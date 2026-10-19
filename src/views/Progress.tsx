import { motion } from "motion/react"
import { BookOpen, Trophy, Target, Sparkles, Check, RotateCcw, Route } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress as ProgressBar } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { allLessons, paths, lessons } from "@/data/curriculum"
import { projects } from "@/data/projects"
import { buildRoadmap, type Preferences } from "@/lib/preferences"
import { cn } from "@/lib/utils"
import type { View } from "@/lib/view"
import type { ProgressApi } from "@/hooks/useProgress"

function lessonPicker(pathId: string) {
  const p = paths.find((x) => x.id === pathId)
  if (!p) return null
  const next = p.lessonIds.map((id) => lessons[id]).find(Boolean)
  return next ? { id: next.id, title: next.title, minutes: next.minutes } : null
}

export default function ProgressPage({
  progress,
  percent,
  prefs,
  resetProgress,
  openLesson,
  go,
  editPrefs,
}: ProgressApi & {
  prefs: Preferences
  percent: number
  openLesson: (id: string) => void
  go: (v: View) => void
  editPrefs: () => void
}) {
  const roadmap = prefs.onboarded ? buildRoadmap(prefs, lessonPicker) : []
  const stats = [
    { label: "Lessons completed", value: `${progress.lessonsCompleted.length} / ${allLessons.length}`, icon: BookOpen },
    { label: "Projects completed", value: `${progress.projectsDone.length} / ${projects.length}`, icon: Trophy },
    { label: "Missions completed", value: `${progress.missionsDone.length}`, icon: Target },
    { label: "Total XP", value: `${progress.xp}`, icon: Sparkles },
  ]

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">My Progress</h1>
          <p className="text-muted-foreground">Everything you have learned and built so far.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={editPrefs}><Route aria-hidden /> Edit preferences</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm"><RotateCcw aria-hidden /> Reset progress</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset all progress?</DialogTitle>
                <DialogDescription>This clears your XP, completed lessons, and projects on this device. It cannot be undone.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => {}}>Cancel</Button>
                <Button variant="destructive" onClick={resetProgress}>Reset everything</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Overall */}
      <section className="surface-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Overall completion</h2>
          <span className="font-display text-2xl font-bold text-primary">{percent}%</span>
        </div>
        <div className="mt-3"><ProgressBar value={percent} className="h-2" aria-label="Overall progress" /></div>
        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-background/40 p-3">
              <dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><s.icon className="size-3.5" aria-hidden /> {s.label}</dt>
              <dd className="mt-1 font-display text-lg font-semibold">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Learning path stage */}
      {roadmap.length > 0 && (
        <section className="surface-card p-6">
          <h2 className="mb-4 font-display text-xl font-semibold">Learning-path stage</h2>
          <ol className="space-y-3">
            {roadmap.map((stage, i) => {
              const complete =
                (stage.view === "learn" && stage.lessonId && progress.lessonsCompleted.includes(stage.lessonId)) ||
                (stage.view === "projects" && stage.projectId && progress.projectsDone.includes(stage.projectId))
              return (
                <li key={i} className="flex items-start gap-3">
                  <span className={cn("grid size-6 shrink-0 place-items-center rounded-full border text-xs", complete ? "border-sim-ok bg-sim-ok text-background" : "border-border text-muted-foreground")}>
                    {complete ? <Check className="size-3.5" aria-hidden /> : i + 1}
                  </span>
                  <div className="flex-1">
                    <p className={cn("text-sm font-medium", complete && "text-muted-foreground line-through")}>{stage.title}</p>
                    <p className="text-xs text-muted-foreground">{stage.minutes} min</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>
      )}

      {/* Per-path breakdown */}
      <section>
        <h2 className="mb-3 font-display text-xl font-semibold">By learning path</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {paths.map((p) => {
            const list = p.lessonIds.map((id) => lessons[id]).filter(Boolean)
            const doneCount = list.filter((l) => progress.lessonsCompleted.includes(l.id)).length
            return (
              <div key={p.id} className="surface-card p-4">
                <div className="flex items-center justify-between">
                  <p className="font-display font-semibold">{p.title}</p>
                  <span className="font-mono text-xs text-primary">{doneCount}/{list.length}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${list.length ? (doneCount / list.length) * 100 : 0}%` }} />
                </div>
                <ul className="mt-3 space-y-1.5">
                  {list.map((l) => {
                    const done = progress.lessonsCompleted.includes(l.id)
                    return (
                      <li key={l.id}>
                        <button onClick={() => openLesson(l.id)} className="flex w-full items-center gap-2 rounded px-1 py-0.5 text-left text-sm hover:bg-muted/60">
                          <span className={cn("grid size-4 shrink-0 place-items-center rounded-full border", done ? "border-sim-ok bg-sim-ok" : "border-border")}>
                            {done && <Check className="size-2.5 text-background" aria-hidden />}
                          </span>
                          <span className={cn("truncate", done && "text-muted-foreground")}>{l.title}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* Projects */}
      <section>
        <h2 className="mb-3 font-display text-xl font-semibold">Projects</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {projects.map((p) => {
            const done = progress.projectsDone.includes(p.id)
            return (
              <button key={p.id} onClick={() => go("projects")} className="text-left">
                <div className={cn("surface-card flex items-center justify-between p-4 transition-colors hover:border-primary/40", done && "border-sim-ok/40")}>
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-xs capitalize text-muted-foreground">{p.level}</p>
                  </div>
                  {done && <span className="flex items-center gap-1 text-xs text-sim-ok"><Check className="size-4" aria-hidden /> Built</span>}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {progress.xp === 0 && progress.lessonsCompleted.length === 0 && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="surface-card p-8 text-center">
          <Sparkles className="mx-auto mb-2 size-6 text-primary" aria-hidden />
          <p className="text-sm text-muted-foreground">
            No progress yet. Finish a lesson or open a simulator to start earning XP.
          </p>
        </motion.section>
      )}
    </div>
  )
}
