import { motion } from "motion/react"
import {
  Play, BookOpen, Bot, Wifi, Wrench, CircuitBoard, ArrowRight, Target, Trophy, Sparkles, Route,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { buildRoadmap, type Preferences, INTEREST_OPTIONS } from "@/lib/preferences"
import { lessons, paths, allLessons } from "@/data/curriculum"
import { projects } from "@/data/projects"
import { cn } from "@/lib/utils"
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

  // Continue learning: last opened activity, else first unfinished recommended lesson.
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

  const stageIndex = Math.min(roadmap.length ? 1 : 0, roadmap.length)

  const metrics = [
    { label: "Lessons", value: `${progress.lessonsCompleted.length}/${allLessons.length}`, icon: BookOpen },
    { label: "Missions", value: `${progress.missionsDone.length}/0`, icon: Target },
    { label: "Projects", value: `${progress.projectsDone.length}/${projects.length}`, icon: Trophy },
    { label: "XP", value: `${progress.xp}`, icon: Sparkles },
  ]

  return (
    <div className="space-y-10">
      {/* A. Continue learning / hero */}
      <section className="space-y-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Route className="size-3.5" aria-hidden /> Interactive Robotics & IoT Lab
          </span>
          <h1 className="max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            What should I do next?
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            {resume
              ? `Pick up where you left off in "${resume.title}".`
              : nextStage
                ? nextStage.desc
                : "Learn, visualize, experiment, and build, with no hardware needed."}
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-3">
          <Button size="lg" onClick={() => (resume ? openLesson(resume.id) : go("learn"))}>
            <Play aria-hidden /> {resume ? "Continue lesson" : "Start Learning"}
          </Button>
          <Button size="lg" variant="outline" onClick={() => go("robotics")}>
            <Bot aria-hidden /> Open Robotics Lab
          </Button>
        </div>
      </section>

      {/* B. Your next step */}
      {nextStage && (
        <section aria-label="Your next step" className="surface-card border-primary/30 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-primary">Your next step</p>
              <h2 className="font-display text-xl font-semibold">{nextStage.title}</h2>
              <p className="text-sm text-muted-foreground">{nextStage.desc}</p>
            </div>
            <Button
              onClick={() => {
                if (nextStage.view === "learn" && nextStage.lessonId) openLesson(nextStage.lessonId)
                else go(nextStage.view)
              }}
            >
              Go <ArrowRight aria-hidden />
            </Button>
          </div>
        </section>
      )}

      {/* C. Quick access */}
      <section aria-label="Quick access">
        <h2 className="mb-3 font-display text-lg font-semibold">Quick access</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {QUICK.map((q) => (
            <button key={q.view} onClick={() => go(q.view)} className="text-left">
              <div className="surface-card h-full space-y-2 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40">
                <span className="grid size-8 place-items-center rounded-lg bg-primary/15 text-primary">
                  <q.icon className="size-4" aria-hidden />
                </span>
                <p className="text-sm font-medium">{q.label}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* D. Recommended for you */}
      {recommended.length > 0 && (
        <section aria-label="Recommended for you">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Recommended for you</h2>
            <button onClick={editPrefs} className="text-xs text-primary hover:underline">
              Adjust preferences
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {recommended.map((l) => (
              <button key={l.id} onClick={() => openLesson(l.id)} className="text-left">
                <div className="surface-card h-full space-y-1.5 p-4 transition-colors hover:border-primary/40">
                  <span className="text-[11px] capitalize text-muted-foreground">{l.difficulty} · {l.minutes} min</span>
                  <p className="font-display font-semibold">{l.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{l.summary}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* E. Your progress */}
      <section aria-label="Your progress" className="surface-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Your progress</h2>
          <span className="font-display text-2xl font-bold text-primary">{percent}%</span>
        </div>
        <div className="mt-3">
          <Progress value={percent} className="h-2" aria-label="Overall progress" />
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-lg border border-border bg-background/40 p-3">
              <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <m.icon className="size-3.5" aria-hidden /> {m.label}
              </dt>
              <dd className="mt-1 font-display text-lg font-semibold">{m.value}</dd>
            </div>
          ))}
        </dl>
        {prefs.onboarded && (
          <p className="mt-4 text-xs text-muted-foreground">
            Learning-path stage: <span className="text-foreground">{stageIndex} of {roadmap.length}</span> planned
            activities started.
          </p>
        )}
      </section>

      {/* Onboarding / tour prompt */}
      {!prefs.onboarded ? (
        <section className="surface-card flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="space-y-1">
            <h2 className="font-display text-lg font-semibold">Personalize your learning path</h2>
            <p className="text-sm text-muted-foreground">Answer a few quick questions and we'll build a roadmap for you.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={editPrefs}>Set up my path</Button>
            <Button variant="ghost" onClick={startTour}>Take the tour</Button>
          </div>
        </section>
      ) : (
        <section className="flex justify-center">
          <Button variant="ghost" onClick={startTour}>
            <Sparkles aria-hidden /> Take the product tour
          </Button>
        </section>
      )}

      {/* F. Explore something new */}
      <section aria-label="Explore something new">
        <h2 className="mb-3 font-display text-lg font-semibold">Explore something new</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {paths
            .filter((p) => !prefs.interests.some((i) => INTEREST_OPTIONS.find((o) => o.id === i)?.pathId === p.id))
            .slice(0, 3)
            .map((p) => (
              <button key={p.id} onClick={() => go("learn")} className="text-left">
                <div className={cn("surface-card h-full space-y-1 p-4 transition-colors hover:border-primary/40")}>
                  <span className="font-mono text-xs text-primary">Path {p.index}</span>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-sm text-muted-foreground">{p.blurb}</p>
                </div>
              </button>
            ))}
        </div>
      </section>
    </div>
  )
}
