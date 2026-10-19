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
    <div className="space-y-8">
      {/* Hero */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {resume ? `Continue: ${resume.title}` : "What should I do next?"}
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            {resume
              ? "Pick up where you left off."
              : nextStage
                ? nextStage.desc
                : "Learn electronics, program microcontrollers, experiment with virtual hardware, and build intelligent systems."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => (resume ? openLesson(resume.id) : go("learn"))}>
            <Play aria-hidden className="size-4" /> {resume ? "Continue lesson" : "Start learning"}
          </Button>
          <Button variant="outline" onClick={() => go("robotics")}>
            <Bot aria-hidden className="size-4" /> Open Robotics Lab
          </Button>
        </div>
      </section>

      {/* Next step */}
      {nextStage && (
        <section className="rounded-none border border-primary/30 bg-primary/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-primary">Your next step</p>
              <h2 className="font-display text-lg font-semibold">{nextStage.title}</h2>
              <p className="text-sm text-muted-foreground">{nextStage.desc}</p>
            </div>
            <Button
              onClick={() => {
                if (nextStage.view === "learn" && nextStage.lessonId) openLesson(nextStage.lessonId)
                else go(nextStage.view)
              }}
            >
              Go <ArrowRight aria-hidden className="size-4" />
            </Button>
          </div>
        </section>
      )}

      {/* Quick access */}
      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Quick access</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {QUICK.map((q) => (
            <button
              key={q.view}
              onClick={() => go(q.view)}
              className="flex flex-col items-start gap-2 rounded-none border border-border bg-card p-4 text-left transition-colors hover:border-primary/40"
            >
              <span className="grid size-9 place-items-center rounded-none bg-primary/15 text-primary">
                <q.icon className="size-4" aria-hidden />
              </span>
              <span className="text-sm font-medium">{q.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Recommended + Progress */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {recommended.length > 0 && (
          <div>
            <h2 className="mb-3 font-display text-lg font-semibold">Recommended for you</h2>
            <div className="space-y-3">
              {recommended.map((l) => (
                <button
                  key={l.id}
                  onClick={() => openLesson(l.id)}
                  className="flex w-full items-start gap-3 rounded-none border border-border bg-card p-4 text-left transition-colors hover:border-primary/40"
                >
                  <span className="mt-0.5 shrink-0 border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                    {l.difficulty}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{l.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{l.summary}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{l.minutes} min</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="rounded-none border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Your progress</h2>
              <span className="font-display text-2xl font-bold text-primary">{percent}%</span>
            </div>
            <Progress value={percent} className="h-2" aria-label="Overall progress" />
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Lessons</p>
                <p className="font-semibold">
                  {progress.lessonsCompleted.length}/{allLessons.length}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Projects</p>
                <p className="font-semibold">
                  {progress.projectsDone.length}/{projects.length}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Missions</p>
                <p className="font-semibold">{progress.missionsDone.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">XP</p>
                <p className="font-semibold">{progress.xp}</p>
              </div>
            </div>
          </div>

          {!prefs.onboarded ? (
            <div className="rounded-none border border-border bg-card p-5">
              <h2 className="font-display text-lg font-semibold">Personalize your path</h2>
              <p className="mt-1 text-sm text-muted-foreground">Answer a few questions for a tailored roadmap.</p>
              <div className="mt-3 flex gap-3">
                <Button onClick={editPrefs}>Set up</Button>
                <Button variant="ghost" onClick={startTour}>
                  Tour
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={startTour}
              className="w-full rounded-none border border-border bg-card p-4 text-left transition-colors hover:border-primary/40"
            >
              <p className="text-sm font-medium">Take the product tour</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Learn where everything lives.</p>
            </button>
          )}
        </div>
      </section>

      {/* Explore */}
      {paths.filter((p) => !prefs.interests.some((i) => INTEREST_OPTIONS.find((o) => o.id === i)?.pathId === p.id)).length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold">Explore other topics</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {paths
              .filter((p) => !prefs.interests.some((i) => INTEREST_OPTIONS.find((o) => o.id === i)?.pathId === p.id))
              .slice(0, 3)
              .map((p) => (
                <button
                  key={p.id}
                  onClick={() => go("learn")}
                  className="rounded-none border border-border bg-card p-4 text-left transition-colors hover:border-primary/40"
                >
                  <p className="text-xs font-medium text-primary">Path {p.index}</p>
                  <p className="mt-1 font-medium">{p.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
                </button>
              ))}
          </div>
        </section>
      )}
    </div>
  )
}