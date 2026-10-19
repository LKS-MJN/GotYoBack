import { useCallback, useEffect, useRef, useState } from "react"
import {
  fromRow,
  initialProgress,
  loadLocal,
  mergeProgress,
  saveLocal,
  toRow,
  type ProgressState,
} from "@/lib/progress"
import { cloudEnabled, getSupabase } from "@/lib/supabase"
import { useAuth } from "@/providers/AuthProvider"

// Local-first: every mutation updates memory + localStorage synchronously, then
// mirrors to the cloud in the background. The UI never waits on the network.
export function useProgress() {
  const { userId, ready } = useAuth()
  const [progress, setProgress] = useState<ProgressState>(loadLocal)
  const [synced, setSynced] = useState(!cloudEnabled)
  const hydrated = useRef(false)

  useEffect(() => {
    saveLocal(progress)
  }, [progress])

  // One-time cloud pull + merge after auth resolves.
  useEffect(() => {
    if (!cloudEnabled || !ready || !userId || hydrated.current) return
    hydrated.current = true
    const supabase = getSupabase()
    if (!supabase) return
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from("progress")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle()
        if (error || !data) {
          void push(userId, loadLocal())
          setSynced(true)
          return
        }
        const merged = mergeProgress(loadLocal(), fromRow(data))
        setProgress(merged)
        void push(userId, merged)
        setSynced(true)
      } catch {
        setSynced(true)
      }
    })()
  }, [userId, ready])

  const push = useCallback(async (uid: string, s: ProgressState) => {
    const supabase = getSupabase()
    if (!supabase) return
    try {
      const { error } = await supabase.from("progress").upsert(toRow(uid, s))
      if (!error) setSynced(true)
    } catch {
      // offline or rate-limited; local copy is already safe
    }
  }, [])

  // Mirror each change to the cloud, debounced so rapid updates coalesce.
  const firstRun = useRef(true)
  useEffect(() => {
    if (!cloudEnabled || !userId || !hydrated.current) return
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    const t = setTimeout(() => void push(userId, { ...progress, updatedAt: Date.now() }), 600)
    return () => clearTimeout(t)
  }, [progress, userId, push])

  const apply = useCallback((fn: (p: ProgressState) => ProgressState) => {
    setProgress((p) => ({ ...fn(p), updatedAt: Date.now() }))
  }, [])

  const awardXp = useCallback(
    (amount: number, achievement?: string) =>
      apply((p) => ({
        ...p,
        xp: p.xp + amount,
        achievements: achievement && !p.achievements.includes(achievement) ? [...p.achievements, achievement] : p.achievements,
      })),
    [apply],
  )

  const completeLesson = useCallback(
    (id: string, xp: number) =>
      apply((p) =>
        p.lessonsCompleted.includes(id)
          ? p
          : { ...p, lessonsCompleted: [...p.lessonsCompleted, id], xp: p.xp + xp },
      ),
    [apply],
  )

  const completeProject = useCallback(
    (id: string, xp: number) =>
      apply((p) =>
        p.projectsDone.includes(id) ? p : { ...p, projectsDone: [...p.projectsDone, id], xp: p.xp + xp },
      ),
    [apply],
  )

  const completeMission = useCallback(
    (id: string, xp: number) =>
      apply((p) =>
        p.missionsDone.includes(id) ? p : { ...p, missionsDone: [...p.missionsDone, id], xp: p.xp + xp },
      ),
    [apply],
  )

  const recordExperiment = useCallback(
    () => apply((p) => ({ ...p, experimentsRun: p.experimentsRun + 1, xp: p.xp + 5 })),
    [apply],
  )

  const recordPrediction = useCallback(
    (correct: boolean) =>
      apply((p) => ({
        ...p,
        predictionsTotal: p.predictionsTotal + 1,
        predictionsCorrect: p.predictionsCorrect + (correct ? 1 : 0),
        xp: p.xp + (correct ? 10 : 2),
      })),
    [apply],
  )

  const resetProgress = useCallback(() => {
    setProgress({ ...initialProgress, updatedAt: Date.now() })
    hydrated.current = false
    firstRun.current = true
    if (cloudEnabled && userId) {
      const supabase = getSupabase()
      void supabase?.from("progress").delete().eq("user_id", userId)
    }
  }, [userId])

  return {
    progress,
    synced,
    awardXp,
    completeLesson,
    completeProject,
    completeMission,
    recordExperiment,
    recordPrediction,
    resetProgress,
  }
}

export type ProgressApi = ReturnType<typeof useProgress>
