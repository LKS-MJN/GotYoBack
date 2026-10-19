export interface ProgressState {
  lessonsCompleted: string[]
  projectsDone: string[]
  missionsDone: string[]
  experimentsRun: number
  predictionsCorrect: number
  predictionsTotal: number
  xp: number
  achievements: string[]
  updatedAt: number
}

export const initialProgress: ProgressState = {
  lessonsCompleted: [],
  projectsDone: [],
  missionsDone: [],
  experimentsRun: 0,
  predictionsCorrect: 0,
  predictionsTotal: 0,
  xp: 0,
  achievements: [],
  updatedAt: 0,
}

const KEY = "robolab-progress-v1"

export function loadLocal(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...initialProgress }
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    return { ...initialProgress, ...parsed }
  } catch {
    return { ...initialProgress }
  }
}

export function saveLocal(state: ProgressState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // storage full or blocked; in-memory state still works
  }
}

// Cloud row shape <-> app state. Keeps DB columns flat and typed.
export interface ProgressRow {
  user_id: string
  xp: number
  lessons_completed: string[]
  projects_done: string[]
  missions_done: string[]
  experiments_run: number
  predictions_correct: number
  predictions_total: number
  achievements: string[]
  updated_at: string
}

export function toRow(userId: string, s: ProgressState): ProgressRow {
  return {
    user_id: userId,
    xp: s.xp,
    lessons_completed: s.lessonsCompleted,
    projects_done: s.projectsDone,
    missions_done: s.missionsDone,
    experiments_run: s.experimentsRun,
    predictions_correct: s.predictionsCorrect,
    predictions_total: s.predictionsTotal,
    achievements: s.achievements,
    updated_at: new Date(s.updatedAt || Date.now()).toISOString(),
  }
}

export function fromRow(r: ProgressRow): ProgressState {
  return {
    lessonsCompleted: r.lessons_completed ?? [],
    projectsDone: r.projects_done ?? [],
    missionsDone: r.missions_done ?? [],
    experimentsRun: r.experiments_run,
    predictionsCorrect: r.predictions_correct,
    predictionsTotal: r.predictions_total,
    achievements: r.achievements ?? [],
    xp: r.xp,
    updatedAt: r.updated_at ? Date.parse(r.updated_at) : 0,
  }
}

// Merge two snapshots by taking the union / max per field, so progress is never
// lost when the same learner plays on two devices. Pure and unit-testable.
export function mergeProgress(a: ProgressState, b: ProgressState): ProgressState {
  return {
    lessonsCompleted: [...new Set([...a.lessonsCompleted, ...b.lessonsCompleted])],
    projectsDone: [...new Set([...a.projectsDone, ...b.projectsDone])],
    missionsDone: [...new Set([...a.missionsDone, ...b.missionsDone])],
    experimentsRun: Math.max(a.experimentsRun, b.experimentsRun),
    predictionsCorrect: Math.max(a.predictionsCorrect, b.predictionsCorrect),
    predictionsTotal: Math.max(a.predictionsTotal, b.predictionsTotal),
    achievements: [...new Set([...a.achievements, ...b.achievements])],
    xp: Math.max(a.xp, b.xp),
    updatedAt: Math.max(a.updatedAt, b.updatedAt),
  }
}
