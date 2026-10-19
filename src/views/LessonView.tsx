import { useState } from "react"
import { motion } from "motion/react"
import { ArrowLeft, Check, X, Copy, ExternalLink, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { lessons, paths, type Block } from "@/data/curriculum"
import { cn } from "@/lib/utils"
import type { ProgressApi } from "@/hooks/useProgress"
import type { View } from "@/lib/view"

function QuizBlock({ b }: { b: Extract<Block, { type: "quiz" }> }) {
  const [pick, setPick] = useState<number | null>(null)
  const checked = pick !== null
  return (
    <section className="surface-card space-y-3 p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-primary">Knowledge check</p>
      <p className="font-medium">{b.question}</p>
      <div className="grid gap-2">
        {b.options.map((opt, i) => {
          const right = checked && i === b.correct
          const wrong = checked && pick === i && i !== b.correct
          return (
            <button
              key={i}
              onClick={() => !checked && setPick(i)}
              disabled={checked}
              className={cn(
                "flex items-center justify-between rounded-lg border px-4 py-2.5 text-left text-sm transition-colors",
                right
                  ? "border-sim-ok bg-sim-ok/15 text-sim-ok"
                  : wrong
                    ? "border-sim-danger bg-sim-danger/15 text-sim-danger"
                    : "border-border hover:bg-muted/60",
              )}
            >
              <span>{opt}</span>
              {right && <Check className="size-4" aria-hidden />}
              {wrong && <X className="size-4" aria-hidden />}
            </button>
          )
        })}
      </div>
      {checked && (
        <p className="rounded-lg border border-border bg-background/50 p-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Why: </span>
          {b.explain}
        </p>
      )}
    </section>
  )
}

function CodeBlock({ b }: { b: Extract<Block, { type: "code" }> }) {
  const [copied, setCopied] = useState(false)
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
          {b.language}
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            navigator.clipboard?.writeText(b.code).then(
              () => { setCopied(true); setTimeout(() => setCopied(false), 1500) },
              () => {},
            )
          }}
        >
          <Copy aria-hidden /> {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="overflow-x-auto rounded-lg border border-border bg-background/60 p-4 text-sm">
        <code className="font-mono text-foreground/90">{b.code}</code>
      </pre>
      {b.explain && <p className="text-sm text-muted-foreground">{b.explain}</p>}
    </section>
  )
}

const SIM_LINK: Record<string, { view: View; label: string }> = {
  robot: { view: "robotics", label: "Open Robotics Lab" },
  iot: { view: "iot", label: "Open IoT Lab" },
  ultrasonic: { view: "robotics", label: "See it in the Robotics Lab" },
  ledcircuit: { view: "components", label: "View component reference" },
}

export default function LessonView({
  lessonId,
  back,
  go,
  progress,
  completeLesson,
}: ProgressApi & {
  lessonId: string
  back: () => void
  go: (v: View) => void
}) {
  const lesson = lessons[lessonId]
  if (!lesson) {
    return (
      <div className="space-y-4 py-16 text-center">
        <p className="text-muted-foreground">That lesson could not be found.</p>
        <Button onClick={back}>Back to Learning Hub</Button>
      </div>
    )
  }
  const path = paths.find((p) => p.id === lesson.pathId)
  const done = progress.lessonsCompleted.includes(lesson.id)

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <button onClick={back} className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden /> {path?.title ?? "Learning Hub"}
      </button>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-primary">
            {path?.title}
          </span>
          <span className="capitalize text-muted-foreground">{lesson.difficulty}</span>
          <span className="text-muted-foreground">· {lesson.minutes} min</span>
        </div>
        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{lesson.title}</h1>
        <p className="text-lg text-muted-foreground">{lesson.summary}</p>
      </header>

      <div className="space-y-7">
        {lesson.blocks.map((b, i) => {
          switch (b.type) {
            case "prose":
              return (
                <section key={i} className="space-y-2">
                  <h2 className="font-display text-xl font-semibold">{b.heading}</h2>
                  <p className="leading-relaxed text-muted-foreground">{b.body}</p>
                </section>
              )
            case "list":
              return (
                <section key={i} className="space-y-2">
                  <h2 className="font-display text-xl font-semibold">{b.heading}</h2>
                  <ul className="space-y-2">
                    {b.items.map((it, j) => (
                      <li key={j} className="flex gap-2.5 text-muted-foreground">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )
            case "code":
              return <CodeBlock key={i} b={b} />
            case "quiz":
              return <QuizBlock key={i} b={b} />
            case "sim": {
              const link = SIM_LINK[b.sim]
              return (
                <section key={i} className="surface-card space-y-3 border-primary/25 bg-primary/5 p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">Interactive experiment</p>
                  <p className="text-sm text-muted-foreground">{b.note}</p>
                  {link && (
                    <Button size="sm" onClick={() => go(link.view)}>
                      <Rocket aria-hidden /> {link.label}
                    </Button>
                  )}
                </section>
              )
            }
            case "challenge":
              return (
                <section key={i} className="surface-card space-y-2 border-sim-warn/30 bg-sim-warn/5 p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-sim-warn">Mini challenge</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{b.prompt}</p>
                </section>
              )
            default:
              return null
          }
        })}
      </div>

      {/* Completion */}
      <div className="surface-card flex flex-wrap items-center justify-between gap-4 border-primary/30 p-6">
        <div className="space-y-1">
          <h2 className="font-display text-lg font-semibold">Finished this lesson?</h2>
          <p className="text-sm text-muted-foreground">
            {done ? "Completed. Great work." : `Mark it done to earn ${lesson.xp} XP.`}
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={back}>Back to hub</Button>
          {!done && (
            <Button variant="outline" onClick={() => { completeLesson(lesson.id, lesson.xp) }}>
              <Check aria-hidden /> Mark complete
            </Button>
          )}
        </div>
      </div>

      {/* Related */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-1.5 font-display text-lg font-semibold">
          Related learning <ExternalLink className="size-4 text-muted-foreground" aria-hidden />
        </h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {paths
            .filter((p) => p.id !== lesson.pathId)
            .slice(0, 3)
            .map((p) => (
              <div key={p.id} className="rounded-lg border border-border bg-background/40 p-3">
                <p className="font-mono text-xs text-primary">Path {p.index}</p>
                <p className="text-sm font-medium">{p.title}</p>
              </div>
            ))}
        </div>
      </section>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2">
        <Button variant="ghost" onClick={back} className="w-full">
          <ArrowLeft aria-hidden /> Back to Learning Hub
        </Button>
      </motion.div>
    </article>
  )
}
