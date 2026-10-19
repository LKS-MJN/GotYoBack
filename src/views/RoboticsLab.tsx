import { useEffect, useMemo, useRef, useState } from "react"
import { Play, Pause, RotateCcw, ChevronRight, Flag, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  createWorld,
  step as stepWorld,
  resetWorld,
  senseDistance,
  DEFAULT_RULES,
  toggleWall,
  type SimWorld,
  type Rule,
  type Heading,
} from "@/lib/sim/robot"
import { cn } from "@/lib/utils"
import type { ProgressApi } from "@/hooks/useProgress"

const ARROW: Record<Heading, string> = { north: "▲", east: "▶", south: "▼", west: "◀" }

export default function RoboticsLab({ recordExperiment }: ProgressApi) {
  const [world, setWorld] = useState<SimWorld>(() => createWorld())
  const [running, setRunning] = useState(false)
  const [editingRules, setEditingRules] = useState<Rule[]>(DEFAULT_RULES)
  const [editThreshold, setEditThreshold] = useState("20")
  const [challenge, setChallenge] = useState(true)
  const [view3D, setView3D] = useState(false)
  const [speed, setSpeed] = useState(1)
  const counted = useRef(false)

  const distance = useMemo(() => senseDistance(world), [world])

  // Auto-run timer.
  useEffect(() => {
    if (!running) return
    if (world.status === "done" || world.status === "halted" || world.status === "collision") {
      setRunning(false)
      return
    }
    const t = setTimeout(() => setWorld((w) => stepWorld(w)), Math.max(150, 400 / speed))
    return () => clearTimeout(t)
  }, [running, world])

  // Count one completed run (reached goal) as an experiment.
  useEffect(() => {
    if (world.reachedGoal && !counted.current) {
      counted.current = true
      recordExperiment()
    }
    if (!world.reachedGoal) counted.current = false
  }, [world.reachedGoal, recordExperiment])

  function applyRules(rules: Rule[]) {
    setEditingRules(rules)
    const next = { ...world, rules }
    setWorld((w) => ({ ...resetWorld(w), rules }))
    setRunning(false)
    void next
  }

  function singleStep() {
    setRunning(false)
    setWorld((w) => stepWorld(w))
  }

  function resetAll() {
    setRunning(false)
    setWorld((w) => resetWorld({ ...w, rules: editingRules }))
    counted.current = false
  }

  function onCellClick(x: number, y: number) {
    if (running) return
    setWorld((w) => ({ ...w, cfg: toggleWall(w.cfg, x, y, w.start) }))
  }

  const statusColor =
    world.reachedGoal ? "text-sim-ok" :
    world.status === "collision" ? "text-sim-danger" :
    world.status === "running" ? "text-primary" : "text-muted-foreground"

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Robotics Lab</h1>
          <p className="text-muted-foreground">Control a robot in a maze and teach it an obstacle-avoidance rule.</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            Sensor <span className="font-mono text-foreground">{distance} cm</span>
          </span>
          <span className={cn("font-medium capitalize", statusColor)}>{world.reachedGoal ? "Goal reached" : world.status}</span>
        </div>
      </header>

      {/* Mission */}
      {challenge && (
        <div className="surface-card border-primary/30 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-primary">Mission</p>
              <h2 className="font-display text-lg font-semibold">Build an obstacle-avoiding robot</h2>
              <p className="text-sm text-muted-foreground">
                Guide the robot to the green goal. Right now it moves forward and will hit a wall. Add a rule so it
                turns when it gets within <span className="font-mono text-foreground">20 cm</span>, then run it.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setChallenge(false)}>Dismiss</Button>
          </div>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* ---------- Maze ---------- */}
        <div className="surface-card mx-auto max-w-3xl p-4 sm:p-5">
          <div
            className="lab-grid grid gap-0.5 transition-transform duration-500"
            style={{
              gridTemplateColumns: `repeat(${world.cfg.width}, minmax(0,1fr))`,
              aspectRatio: `${world.cfg.width} / ${world.cfg.height}`,
              transform: view3D ? "perspective(900px) rotateX(40deg) rotateZ(-16deg)" : "none",
              transformOrigin: "center center",
            }}
            role="grid"
            aria-label="Robot maze"
          >
            {Array.from({ length: world.cfg.height }).map((_, y) =>
              Array.from({ length: world.cfg.width }).map((_, x) => {
                const wall = world.cfg.walls.has(`${x},${y}`)
                const isStart = world.start.x === x && world.start.y === y
                const isGoal = world.cfg.goal.x === x && world.cfg.goal.y === y
                const isRobot = world.robot.x === x && world.robot.y === y
                const onPath = world.path.some((p) => p.x === x && p.y === y)
                return (
                  <button
                    key={`${x},${y}`}
                    onClick={() => onCellClick(x, y)}
                    disabled={running}
                    aria-label={`Cell ${x},${y}${wall ? ", wall" : ""}`}
                    className={cn(
                      "relative grid place-items-center rounded text-xs transition-colors",
                      wall
                        ? "bg-sim-idle/70"
                        : isGoal
                          ? "bg-sim-ok/15 hover:bg-sim-ok/25"
                          : "bg-background/50 hover:bg-muted/70",
                      !wall && onPath && "ring-1 ring-inset ring-primary/30",
                    )}
                  >
                    {isGoal && <Flag className="size-4 text-sim-ok" aria-hidden />}
                    {isStart && !isRobot && !isGoal && <span className="font-mono text-[10px] text-muted-foreground">S</span>}
                    {isRobot && (
                      <span
                        className="grid size-7 place-items-center rounded-full bg-primary font-mono text-xs font-bold text-primary-foreground shadow-[0_0_0_3px_var(--primary)]"
                      >
                        {ARROW[world.robot.heading]}
                      </span>
                    )}
                  </button>
                )
              }),
            )}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Click an empty cell to toggle a wall. Border walls are locked.
          </p>
        </div>

        {/* ---------- Controls + rules ---------- */}
        <div className="space-y-5">
          <div className="surface-card p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={() => (running ? setRunning(false) : setRunning(true))} className="min-w-28" disabled={world.status === "done"}>
                {running ? <><Pause aria-hidden /> Pause</> : <><Play aria-hidden /> Run</>}
              </Button>
              <Button variant="outline" onClick={singleStep}>
                Step <ChevronRight aria-hidden />
              </Button>
              <Button variant="ghost" onClick={resetAll} aria-label="Reset">
                <RotateCcw aria-hidden /> Reset
              </Button>
              <Button
                variant={view3D ? "default" : "outline"}
                onClick={() => setView3D((v) => !v)}
                aria-pressed={view3D}
              >
                {view3D ? "2D view" : "3D view"}
              </Button>
            </div>
            <div className="mt-3 flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">Speed</span>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="flex-1 accent-[var(--sim-target)]"
                aria-label="Simulation speed"
              />
              <span className="w-8 font-mono text-xs text-foreground">{speed}x</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Steps taken</span>
              <span className="font-mono">{world.stepCount}</span>
            </div>
          </div>

          {/* Rule editor */}
          <div className="surface-card space-y-4 p-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-primary">Rule engine</p>
              <h3 className="font-display font-semibold">IF distance &lt; threshold THEN action</h3>
            </div>

            {editingRules.map((rule, i) => (
              <div key={rule.id} className="space-y-2 rounded-lg border border-border bg-background/40 p-3">
                <p className="font-mono text-xs text-muted-foreground">Rule {i + 1}</p>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-muted-foreground">IF distance &lt;</span>
                  <Input
                    value={editThreshold}
                    onChange={(e) => setEditThreshold(e.target.value.replace(/[^0-9]/g, ""))}
                    inputMode="numeric"
                    className="h-8 w-16 text-center font-mono"
                    aria-label="Distance threshold in centimetres"
                  />
                  <span className="text-muted-foreground">cm THEN</span>
                  <select
                    value={rule.action}
                    onChange={(e) => {
                      const rules = editingRules.map((r, idx) =>
                        idx === i ? { ...r, action: e.target.value as Rule["action"] } : r,
                      )
                      applyRules(rules)
                    }}
                    className="rounded-md border border-border bg-background px-2 py-1 text-sm"
                    aria-label="Action"
                  >
                    <option value="turn-right">turn right</option>
                    <option value="turn-left">turn left</option>
                    <option value="stop">stop</option>
                    <option value="halt">halt</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applyRules([{ ...rule, threshold: Number(editThreshold) || 20 }])}
                  >
                    Apply threshold
                  </Button>
                  {editingRules.length > 1 && (
                    <Button size="sm" variant="ghost" onClick={() => applyRules(editingRules.filter((_, idx) => idx !== i))}>
                      <Minus aria-hidden /> Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  applyRules([
                    ...editingRules,
                    { id: `r${Date.now()}`, metric: "distance", op: "<", threshold: 20, action: "turn-left" },
                  ])
                }
              >
                <Plus aria-hidden /> Add rule
              </Button>
              <Button size="sm" variant="ghost" onClick={() => applyRules(DEFAULT_RULES)}>
                Reset rules
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Rules are checked top to bottom; the first match wins. With no match the robot moves forward.
            </p>
          </div>
        </div>
      </div>

      {/* ---------- Event log ---------- */}
      <div className="surface-card p-5">
        <h3 className="mb-3 font-display font-semibold">Simulation event log</h3>
        {world.log.length === 0 ? (
          <p className="text-sm text-muted-foreground">No events yet. Run or step the robot to see what it decides.</p>
        ) : (
          <ul className="max-h-64 space-y-2 overflow-y-auto font-mono text-xs">
            {world.log
              .slice()
              .reverse()
              .map((e) => (
                <li key={e.step} className="flex flex-wrap items-baseline gap-2 rounded border border-border bg-background/50 px-2 py-1.5 leading-relaxed">
                  <span className="text-muted-foreground">#{String(e.step).padStart(3, "0")}</span>
                  <span className="text-primary">{e.distance}cm</span>
                  <span className={e.collided ? "text-sim-danger" : "text-foreground/80"}>
                    [{e.matchedRule}] {e.note}
                  </span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  )
}
