import { useState } from "react"
import { motion } from "motion/react"
import { Search, Check, Clock, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { paths, lessons, lessonsForPath, type Lesson } from "@/data/curriculum"
import { cn } from "@/lib/utils"
import type { ProgressApi } from "@/hooks/useProgress"

const DIFF_COLOR: Record<Lesson["difficulty"], string> = {
  beginner: "text-sim-ok border-sim-ok/40 bg-sim-ok/10",
  intermediate: "text-sim-warn border-sim-warn/40 bg-sim-warn/10",
  advanced: "text-sim-danger border-sim-danger/40 bg-sim-danger/10",
}

export default function Learn({ progress, openLesson }: ProgressApi & { openLesson: (id: string) => void }) {
  const [q, setQ] = useState("")
  const [activePath, setActivePath] = useState<string | null>(null)

  const done = (id: string) => progress.lessonsCompleted.includes(id)
  const filtered = q.trim()
    ? Object.values(lessons).filter(
        (l) =>
          l.title.toLowerCase().includes(q.toLowerCase()) ||
          l.summary.toLowerCase().includes(q.toLowerCase()),
      )
    : null

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <div className="space-y-1.5">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Learning Hub</h1>
          <p className="text-muted-foreground">Structured paths from first circuit to working robot.</p>
        </div>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search lessons..."
            className="pl-9"
            aria-label="Search lessons"
          />
        </div>
      </header>

      {/* Search results */}
      {filtered ? (
        <section aria-label="Search results">
          <p className="mb-3 text-sm text-muted-foreground">
            {filtered.length} result{filtered.length === 1 ? "" : "s"} for "{q}"
          </p>
          <div className="grid gap-3">
            {filtered.length === 0 ? (
              <div className="surface-card p-6 text-center text-sm text-muted-foreground">
                No lessons match that search. Try "sensor", "Arduino", or "Ohm".
              </div>
            ) : (
              filtered.map((l) => (
                <button key={l.id} onClick={() => openLesson(l.id)} className="surface-card p-4 text-left transition-colors hover:border-primary/40">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-display font-semibold">{l.title}</span>
                    <span className={cn("rounded border px-1.5 py-0.5 text-[11px] capitalize", DIFF_COLOR[l.difficulty])}>
                      {l.difficulty}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{l.summary}</p>
                </button>
              ))
            )}
          </div>
        </section>
      ) : (
        <>
          {/* Path cards */}
          <section className="grid gap-4 md:grid-cols-2" aria-label="Learning paths">
            {paths.map((p, i) => {
              const list = lessonsForPath(p.id)
              const doneCount = list.filter((l) => done(l.id)).length
              const open = activePath === p.id
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="surface-card p-5"
                >
                  <button
                    onClick={() => setActivePath(open ? null : p.id)}
                    className="flex w-full items-start justify-between gap-3 text-left"
                    aria-expanded={open}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-primary">Path {p.index}</span>
                        <span className={cn("rounded border px-1.5 py-0.5 text-[11px] capitalize", DIFF_COLOR[p.level])}>
                          {p.level}
                        </span>
                      </div>
                      <h2 className="font-display text-lg font-semibold">{p.title}</h2>
                      <p className="text-sm text-muted-foreground">{p.blurb}</p>
                    </div>
                    <ChevronRight className={cn("size-5 shrink-0 text-muted-foreground transition-transform", open && "rotate-90")} aria-hidden />
                  </button>

                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{doneCount}/{list.length} lessons</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <span
                        className="block h-full rounded-full bg-primary transition-all"
                        style={{ width: `${list.length ? (doneCount / list.length) * 100 : 0}%` }}
                      />
                    </span>
                  </div>

                  {open && (
                    <ul className="mt-4 space-y-2 border-t border-border pt-4">
                      {list.map((l) => (
                        <li key={l.id}>
                          <button
                            onClick={() => openLesson(l.id)}
                            className="flex w-full items-center justify-between gap-3 rounded-none px-2 py-2 text-left transition-colors hover:bg-muted/60"
                          >
                            <span className="flex min-w-0 items-center gap-2">
                              <span className={cn("grid size-5 shrink-0 place-items-center rounded-full border", done(l.id) ? "border-sim-ok bg-sim-ok text-background" : "border-border")}>
                                {done(l.id) ? <Check className="size-3" aria-hidden /> : null}
                              </span>
                              <span className="truncate text-sm">{l.title}</span>
                            </span>
                            <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="size-3" aria-hidden /> {l.minutes}m
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )
            })}
          </section>
        </>
      )}
    </div>
  )
}
