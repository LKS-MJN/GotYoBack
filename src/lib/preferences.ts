// Structured onboarding preferences + deterministic roadmap recommendation.
// No AI, no backend: the roadmap is derived purely from the user's answers.

export type Level = "beginner" | "some" | "experienced"
export type Style = "guided" | "handsOn" | "project"

export interface Preferences {
  onboarded: boolean
  tourDone: boolean
  level: Level | null
  interests: string[] // interest ids
  goal: string // goal id
  styles: Style[]
  lastActivity: { view: string; id?: string } | null
}

export const defaultPreferences: Preferences = {
  onboarded: false,
  tourDone: false,
  level: null,
  interests: [],
  goal: "",
  styles: [],
  lastActivity: null,
}

const KEY = "gotyoback-prefs-v1"

export function loadPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...defaultPreferences }
    return { ...defaultPreferences, ...(JSON.parse(raw) as Partial<Preferences>) }
  } catch {
    return { ...defaultPreferences }
  }
}

export function savePreferences(p: Preferences) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    // storage unavailable; onboarding still works in memory
  }
}

// ---- Onboarding configuration data ----

export interface LevelOption {
  id: Level
  title: string
  desc: string
  start: string[] // path ids recommended as a starting point
}

export const LEVEL_OPTIONS: LevelOption[] = [
  { id: "beginner", title: "Complete Beginner", desc: "I am new to electronics, circuits, and robotics.", start: ["electronics", "arduino"] },
  { id: "some", title: "Some Experience", desc: "I know the basics and want to build practical projects.", start: ["arduino", "sensors"] },
  { id: "experienced", title: "Experienced Learner", desc: "I have worked with microcontrollers or built projects before.", start: ["robotics", "esp32"] },
]

export interface InterestOption {
  id: string
  title: string
  desc: string
  pathId: string
}

export const INTEREST_OPTIONS: InterestOption[] = [
  { id: "electronics", title: "Electronics Fundamentals", desc: "Voltage, current, and core components.", pathId: "electronics" },
  { id: "arduino", title: "Arduino & Microcontrollers", desc: "Digital I/O, analog, and sketches.", pathId: "arduino" },
  { id: "esp32", title: "ESP32 & ESP8266", desc: "Wi-Fi boards and network projects.", pathId: "esp32" },
  { id: "sensors", title: "Sensors & Actuators", desc: "Ultrasonic, IR, temperature, motors.", pathId: "sensors" },
  { id: "robotics", title: "Robotics & Robot Control", desc: "Drive systems and autonomous motion.", pathId: "robotics" },
  { id: "iot", title: "IoT & Smart Automation", desc: "Connected devices and dashboards.", pathId: "iot" },
  { id: "circuit", title: "Circuit Design", desc: "Series, parallel, and safe wiring.", pathId: "electronics" },
  { id: "projects", title: "Practical Hardware Projects", desc: "Complete guided builds.", pathId: "projects" },
]

export const GOAL_OPTIONS: { id: string; title: string }[] = [
  { id: "fundamentals", title: "Understand the fundamentals" },
  { id: "first-project", title: "Build my first electronics project" },
  { id: "programming", title: "Learn Arduino or ESP32 programming" },
  { id: "robot", title: "Build and control a robot" },
  { id: "iot-system", title: "Create an IoT or smart-home system" },
  { id: "debugging", title: "Improve my debugging and hardware skills" },
  { id: "explore", title: "Explore everything step by step" },
]

export const STYLE_OPTIONS: { id: Style; title: string; desc: string }[] = [
  { id: "guided", title: "Guided Learning", desc: "Short lessons, explanations, diagrams, and examples." },
  { id: "handsOn", title: "Hands-On Experiments", desc: "Interactive simulations and adjustable values." },
  { id: "project", title: "Project-Based Learning", desc: "Complete builds with wiring, code, and troubleshooting." },
]

// ---- Roadmap recommendation ----

export interface RoadmapStage {
  title: string
  desc: string
  view: "learn" | "robotics" | "iot" | "projects"
  lessonId?: string
  projectId?: string
  minutes: number
}

/**
 * Build a personalized roadmap from the user's answers.
 * `lessonPicker` resolves the first incomplete lesson for a path so we always
 * link to real, existing content.
 */
export function buildRoadmap(
  prefs: Preferences,
  lessonPicker: (pathId: string) => { id: string; title: string; minutes: number } | null,
): RoadmapStage[] {
  const stages: RoadmapStage[] = []
  const level = prefs.level ?? "beginner"

  const interestPathIds = prefs.interests
    .map((i) => INTEREST_OPTIONS.find((o) => o.id === i)?.pathId)
    .filter((x): x is string => Boolean(x))
  const levelStart = LEVEL_OPTIONS.find((l) => l.id === level)?.start ?? ["electronics", "arduino"]

  // Level-recommended paths first, then the user's interests, deduped.
  const seq: string[] = []
  for (const p of levelStart) if (!seq.includes(p)) seq.push(p)
  for (const p of interestPathIds) if (!seq.includes(p)) seq.push(p)
  if (seq.length === 0) seq.push("electronics", "arduino")

  for (const pathId of seq.slice(0, 5)) {
    const lesson = lessonPicker(pathId)
    if (!lesson) continue
    const pathTitle = pathId.charAt(0).toUpperCase() + pathId.slice(1)
    stages.push({
      title: `Learn: ${lesson.title}`,
      desc: `Start the ${pathTitle} path with this foundational lesson.`,
      view: "learn",
      lessonId: lesson.id,
      minutes: lesson.minutes,
    })
    // One experiment stage per path keeps the Learn -> Experiment rhythm.
    if (pathId === "robotics" || pathId === "sensors") {
      stages.push({
        title: "Experiment: Robotics Lab",
        desc: "Drive a simulated robot and watch sensor readings change live.",
        view: "robotics",
        minutes: 10,
      })
    }
    if (pathId === "iot" || pathId === "esp32") {
      stages.push({
        title: "Experiment: IoT Lab",
        desc: "Change sensor values and see automation rules fire on a dashboard.",
        view: "iot",
        minutes: 10,
      })
    }
  }

  // Always finish with a build stage so the path ends on a real project.
  stages.push({
    title: "Build: Obstacle-Avoiding Robot",
    desc: "Apply your skills in a complete guided project.",
    view: "projects",
    projectId: "proj-obstacle-robot",
    minutes: 25,
  })

  return stages
}

/** The next recommended stage for the dashboard. */
export function nextStage(prefs: Preferences, lessonPicker: (pathId: string) => { id: string; title: string; minutes: number } | null): RoadmapStage | null {
  return buildRoadmap(prefs, lessonPicker)[0] ?? null
}
