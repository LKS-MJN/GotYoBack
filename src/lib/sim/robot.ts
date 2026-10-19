// Robot maze simulation engine.
// Pure state machine: the UI calls step() / reset() and renders the result.
// Sensor readings come from real raycasting against the grid walls, and the
// IF-THEN rules are genuinely evaluated each step. No fake animation.

export type Heading = "north" | "east" | "south" | "west"

export type RuleAction = "forward" | "turn-right" | "turn-left" | "stop" | "halt"

export interface Rule {
  id: string
  metric: "distance" // only distance for now, kept extensible
  op: "<" | ">" | "<=" | ">="
  threshold: number // cm
  action: RuleAction
}

export interface RobotState {
  x: number
  y: number
  heading: Heading
}

export type RunStatus = "idle" | "running" | "paused" | "done" | "halted" | "collision"

export interface LogEvent {
  step: number
  distance: number
  matchedRule: RuleAction | "default-forward"
  collided: boolean
  note: string
}

export interface SimConfig {
  width: number
  height: number
  /** Grid cells that are walls, as "x,y" keys. */
  walls: Set<string>
  goal: { x: number; y: number }
  maxRange: number // cm, ultrasonic ceiling
  cellSize: number // cm per cell
}

export interface SimWorld {
  cfg: SimConfig
  robot: RobotState
  start: RobotState
  stepCount: number
  status: RunStatus
  log: LogEvent[]
  path: { x: number; y: number }[]
  rules: Rule[]
  speed: number // cells per tick is always 1; speed only affects UI timer
  reachedGoal: boolean
}

const HEADINGS: Heading[] = ["north", "east", "south", "west"]
const DELTA: Record<Heading, { dx: number; dy: number }> = {
  north: { dx: 0, dy: -1 },
  east: { dx: 1, dy: 0 },
  south: { dx: 0, dy: 1 },
  west: { dx: -1, dy: 0 },
}

export function defaultMaze(): SimConfig {
  const width = 10
  const height = 7
  const walls = new Set<string>()
  // Outer border walls.
  for (let x = 0; x < width; x++) {
    walls.add(`${x},0`)
    walls.add(`${x},${height - 1}`)
  }
  for (let y = 0; y < height; y++) {
    walls.add(`0,${y}`)
    walls.add(`${width - 1},${y}`)
  }
  // Interior obstacle blocks to steer around.
  ;[
    [4, 2],
    [4, 3],
    [4, 4],
    [7, 2],
    [7, 3],
    [2, 5],
    [3, 5],
  ].forEach(([x, y]) => walls.add(`${x},${y}`))
  return { width, height, walls, goal: { x: 8, y: 5 }, maxRange: 60, cellSize: 10 }
}

export const DEFAULT_RULES: Rule[] = [
  { id: "r1", metric: "distance", op: "<", threshold: 20, action: "turn-right" },
]

export function createWorld(cfg: SimConfig = defaultMaze(), rules: Rule[] = DEFAULT_RULES): SimWorld {
  const start: RobotState = { x: 2, y: 2, heading: "east" }
  return {
    cfg,
    robot: { ...start },
    start,
    stepCount: 0,
    status: "idle",
    log: [],
    path: [{ x: start.x, y: start.y }],
    rules: rules.map((r) => ({ ...r })),
    speed: 1,
    reachedGoal: false,
  }
}

function isWall(cfg: SimConfig, x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= cfg.width || y >= cfg.height) return true
  return cfg.walls.has(`${x},${y}`)
}

/** Raycast one cell at a time in the heading direction. Returns cm to the nearest wall, capped at maxRange. */
export function senseDistance(world: SimWorld): number {
  const { cfg, robot } = world
  const { dx, dy } = DELTA[robot.heading]
  let cells = 0
  let x = robot.x
  let y = robot.y
  while (cells < cfg.maxRange / cfg.cellSize) {
    x += dx
    y += dy
    cells++
    if (isWall(cfg, x, y)) break
  }
  return cells * cfg.cellSize
}

/** Evaluate the rule list top-down; first match wins. Returns the action to take. */
export function evaluateRules(rules: Rule[], distance: number): { action: RuleAction; matched: boolean } {
  for (const r of rules) {
    const pass =
      r.op === "<" ? distance < r.threshold
      : r.op === ">" ? distance > r.threshold
      : r.op === "<=" ? distance <= r.threshold
      : distance >= r.threshold
    if (pass) return { action: r.action, matched: true }
  }
  return { action: "forward", matched: false }
}

function rotate(h: Heading, dir: 1 | -1): Heading {
  const i = HEADINGS.indexOf(h)
  return HEADINGS[(i + dir + 4) % 4]
}

/**
 * Advance the world by exactly one step. Reads the sensor, evaluates the rules,
 * applies the resulting action, checks for collisions, and appends a log entry.
 */
export function step(world: SimWorld): SimWorld {
  if (world.status === "halted" || world.status === "done" || world.status === "collision") return world

  const distance = senseDistance(world)
  const { action, matched } = evaluateRules(world.rules, distance)

  const robot = { ...world.robot }
  let collided = false
  let note = ""
  let status: RunStatus = "running"
  let reachedGoal = world.reachedGoal

  if (action === "forward") {
    const { dx, dy } = DELTA[robot.heading]
    const nx = robot.x + dx
    const ny = robot.y + dy
    if (isWall(world.cfg, nx, ny)) {
      collided = true
      status = "collision"
      note = `Tried to move ${robot.heading} into a wall at (${nx}, ${ny}). No rule prevented the move.`
    } else {
      robot.x = nx
      robot.y = ny
      note = `Moved ${robot.heading} to (${nx}, ${ny}).`
      if (nx === world.cfg.goal.x && ny === world.cfg.goal.y) {
        reachedGoal = true
        status = "done"
        note += " Goal reached!"
      }
    }
  } else if (action === "turn-right") {
    robot.heading = rotate(robot.heading, 1)
    note = `Obstacle ${distance} cm ahead. Turned right, now facing ${robot.heading}.`
  } else if (action === "turn-left") {
    robot.heading = rotate(robot.heading, -1)
    note = `Turned left, now facing ${robot.heading}.`
  } else if (action === "stop") {
    note = `Stopped in place (${distance} cm clearance).`
  } else {
    status = "halted"
    note = "Halted by rule."
  }

  // Safety valve: avoid infinite loops on a deterministic cycle.
  const stepCount = world.stepCount + 1
  if (stepCount > 400 && status === "running") {
    status = "done"
    note = " Step limit reached."
  }

  const event: LogEvent = {
    step: stepCount,
    distance,
    matchedRule: matched ? action : "default-forward",
    collided,
    note,
  }

  const path = collided ? world.path : [...world.path, { x: robot.x, y: robot.y }]

  return {
    ...world,
    robot,
    stepCount,
    status,
    reachedGoal,
    path,
    log: [...world.log, event],
  }
}

export function resetWorld(world: SimWorld): SimWorld {
  return {
    ...world,
    robot: { ...world.start },
    stepCount: 0,
    status: "idle",
    log: [],
    path: [{ x: world.start.x, y: world.start.y }],
    reachedGoal: false,
  }
}

export function toggleWall(cfg: SimConfig, x: number, y: number, start: RobotState): SimConfig {
  // Border stays locked; cannot wall off the robot's start or the goal.
  if (x === 0 || y === 0 || x === cfg.width - 1 || y === cfg.height - 1) return cfg
  if (x === start.x && y === start.y) return cfg
  if (x === cfg.goal.x && y === cfg.goal.y) return cfg
  const key = `${x},${y}`
  const walls = new Set(cfg.walls)
  if (walls.has(key)) walls.delete(key)
  else walls.add(key)
  return { ...cfg, walls }
}
