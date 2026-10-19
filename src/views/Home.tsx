import { Play, BookOpen, Bot, Wifi, Wrench, CircuitBoard, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { buildRoadmap, type Preferences, INTEREST_OPTIONS } from "@/lib/preferences"
import { lessons, paths, allLessons } from "@/data/curriculum"
import { projects } from "@/data/projects"
import type { View } from "@/lib/view"
import type { ProgressApi } from "@/hooks/useProgress"

const QUICK = [
  { view: "learn", label: "Learning Hub", icon: BookOpen },
  { view: "robotics", label: "Robotics Lab", icon: Bot },
  { view: "iot", label: "IoT Lab", icon: Wifi },
  { view: "projects", label: "Projects", icon: Wrench },
  { view: "components", label: "Components", icon: CircuitBoard },
] as const

function lessonPicker(pathId: string) {
  const p = paths.find((x) => x.id === pathId)
  if (!p) return null
  const next = p.lessonIds.map((id) => lessons[id]).find(Boolean)
  return next ? { id: next.id, title: next.title, minutes: next.minutes } : null
}

export default function Home({
  go,
  openLesson,
  progress,
  prefs,
  percent,
  startTour,
  editPrefs,
}: ProgressApi & {
  go: (v: View) => void
  openLesson: (id: string) => void
  prefs: Preferences
  percent: number
  startTour: () => void
  editPrefs: () => void
}) {
  const roadmap = prefs.onboarded ? buildRoadmap(prefs, lessonPicker) : []
  const nextStage = roadmap[0] ?? null
  const last = prefs.lastActivity?.view === "lesson" && prefs.lastActivity.id ? lessons[prefs.lastActivity.id] : null
  const resume = last && !progress.lessonsCompleted.includes(last.id) ? last : null
  const recommended = (prefs.interests.length
    ? prefs.interests
        .map((i) => INTEREST_OPTIONS.find((o) => o.id === i)?.pathId)
        .filter(Boolean)
        .flatMap((pid) => paths.find((p) => p.id === pid)?.lessonIds ?? [])
    : allLessons.map((l) => l.id)
  )
    .map((id) => lessons[id])
    .filter((l) => l && !progress.lessonsCompleted.includes(l.id))
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Compact header */}
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {resume ? `Continue "${resume.title}"` : nextStage ? nextStage.desc : "Pick a path to start learning."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => (resume ? openLesson(resume.id) : go("learn"))}>
            <Play aria-hidden className="size-3.5" /> {resume ? "Continue" : "Start"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => go("robotics")}>
            <Bot aria-hidden className="size-3.5" /> Robotics Lab
          </Button>
        </div>
      </div>

      {/* Next step */}
      {nextStage && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-primary">Next step</p>
            <p className="truncate text-sm font-medium">{nextStage.title}</p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              if (nextStage.view === "learn" && nextStage.lessonId) openLesson(nextStage.lessonId)
              else go(nextStage.view)
            }}
          >
            Go <ArrowRight aria-hidden className="size-3.5" />
          </Button>
        </div>
      )}

      {/* Quick access */}
      <div>
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">Quick access</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {QUICK.map((q) => (
            <button
              key={q.view}
              onClick={() => go(q.view)}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-left text-sm transition-colors hover:border-primary/40 hover:bg-muted/40"
            >
              <q.icon className="size-4 shrink-0 text-primary" aria-hidden />
              <span className="truncate">{q.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recommended + Progress */}
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {recommended.length > 0 && (
          <div>
            <h2 className="mb-2 text-sm font-medium text-muted-foreground">Recommended for you</h2>
            <div className="space-y-2">
              {recommended.map((l) => (
                <button
                  key={l.id}
                  onClick={() => openLesson(l.id)}
                  className="flex w-full items-start gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-left transition-colors hover:border-primary/40"
                >
                  <span
                    className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium capitalize ${
                      l.difficulty === "beginner"
                        ? "bg-sim-ok/15 text-sim-ok"
                        : l.difficulty === "intermediate"
                          ? "bg-sim-warn/15 text-sim-warn"
                          : "bg-sim-danger/15 text-sim-danger"
                    }`}
                  >
                    {l.difficulty}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{l.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{l.summary}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{l.minutes}m</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm font-semibold text-primary">{percent}%</span>
            </div>
            <Progress value={percent} className="h-1.5" aria-label="Overall progress" />
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <span className="text-muted-foreground">
                Lessons <span className="text-foreground">{progress.lessonsCompleted.length}/{allLessons.length}</span>
              </span>
              <span className="text-muted-foreground">
                Projects <span className="text-foreground">{progress.projectsDone.length}/{projects.length}</span>
              </span>
              <span className="text-muted-foreground">
                Missions <span className="text-foreground">{progress.missionsDone.length}</span>
              </span>
              <span className="text-muted-foreground">
                XP <span className="text-foreground">{progress.xp}</span>
              </span>
            </div>
          </div>

          {!prefs.onboarded ? (
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-sm font-medium">Personalize your path</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Answer a few questions for a tailored roadmap.</p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" onClick={editPrefs}>
                  Set up
                </Button>
                <Button size="sm" variant="ghost" onClick={startTour}>
                  Tour
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={startTour}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-muted/40"
            >
              Take the product tour
            </button>
          )}
        </div>
      </div>

      {/* Explore */}
      {paths.filter((p) => !prefs.interests.some((i) => INTEREST_OPTIONS.find((o) => o.id === i)?.pathId === p.id)).length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-medium text-muted-foreground">Explore other topics</h2>
          <div className="grid gap-2 sm:grid-cols-3">
            {paths
              .filter((p) => !prefs.interests.some((i) => INTEREST_OPTIONS.find((o) => o.id === i)?.pathId === p.id))
              .slice(0, 3)
              .map((p) => (
                <button
                  key={p.id}
                  onClick={() => go("learn")}
                  className="rounded-lg border border-border bg-card px-3 py-2 text-left transition-colors hover:border-primary/40"
                >
                  <p className="text-xs font-medium text-primary">Path {p.index}</p>
                  <p className="text-sm font-medium">{p.title}</p>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}