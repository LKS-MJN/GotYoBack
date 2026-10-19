import { useState } from "react"
import { motion } from "motion/react"
import { Check, Copy, ChevronDown, Rocket, Wrench, Bug } from "lucide-react"
import { Button } from "@/components/ui/button"
import { projects, type ProjectGuide } from "@/data/projects"
import { cn } from "@/lib/utils"
import type { View } from "@/lib/view"
import type { ProgressApi } from "@/hooks/useProgress"

const LEVEL_COLOR: Record<ProjectGuide["level"], string> = {
  beginner: "text-sim-ok border-sim-ok/40 bg-sim-ok/10",
  intermediate: "text-sim-warn border-sim-warn/40 bg-sim-warn/10",
  advanced: "text-sim-danger border-sim-danger/40 bg-sim-danger/10",
}

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-t border-border">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between py-3 text-left" aria-expanded={open}>
        <span className="font-display text-sm font-semibold">{title}</span>
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  )
}

function ProjectCard({ p, go, complete, done }: { p: ProjectGuide; go: (v: View) => void; complete: () => void; done: boolean }) {
  const [copied, setCopied] = useState(false)
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="surface-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={cn("rounded border px-1.5 py-0.5 text-[11px] capitalize", LEVEL_COLOR[p.level])}>{p.level}</span>
            <span className="font-mono text-xs text-muted-foreground">{p.minutes} min</span>
            {done && (
              <span className="flex items-center gap-1 rounded-full border border-sim-ok/40 bg-sim-ok/10 px-2 py-0.5 text-[11px] text-sim-ok">
                <Check className="size-3" aria-hidden /> Done
              </span>
            )}
          </div>
          <h2 className="font-display text-xl font-semibold">{p.title}</h2>
          <p className="text-sm text-muted-foreground">{p.objective}</p>
        </div>
        <span className="shrink-0 rounded-lg bg-primary/15 px-2.5 py-1 font-display text-sm font-semibold text-primary">+60 XP</span>
      </div>

      <div className="mt-3">
        <Section title="Components" defaultOpen>
          <ul className="flex flex-wrap gap-2">
            {p.components.map((c) => (
              <li key={c} className="rounded-lg border border-border bg-background/40 px-2.5 py-1 text-xs text-muted-foreground">
                {c}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Code" defaultOpen>
          <div className="flex items-center justify-between">
            <span className="rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">cpp</span>
            <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard?.writeText(p.code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) }, () => {}) }}>
              <Copy aria-hidden /> {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-background/60 p-4 text-sm">
            <code className="font-mono text-foreground/90">{p.code}</code>
          </pre>
          <p className="mt-2 text-sm text-muted-foreground">{p.explain}</p>
        </Section>

        <Section title="Expected behavior">
          <p className="text-sm text-muted-foreground">{p.expected}</p>
        </Section>

        <Section title="Troubleshooting">
          <ul className="space-y-2">
            {p.troubleshoot.map((t, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
                <Bug className="mt-0.5 size-4 shrink-0 text-sim-warn" aria-hidden />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Extension challenge">
          <p className="text-sm text-muted-foreground">{p.challenge}</p>
        </Section>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 border-t border-border pt-4">
        {p.sim && <Button size="sm" onClick={() => go(p.sim === "robot" ? "robotics" : "iot")}><Rocket aria-hidden /> Try in simulator</Button>}
        {!done && (
          <Button size="sm" variant="outline" onClick={complete}>
            <Wrench aria-hidden /> Mark built
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export default function Projects({ go, progress, completeProject }: ProgressApi & { go: (v: View) => void }) {
  const [filter, setFilter] = useState<"all" | ProjectGuide["category"]>("all")
  const list = filter === "all" ? projects : projects.filter((p) => p.category === filter)

  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Projects</h1>
        <p className="text-muted-foreground">Complete builds with components, code, and troubleshooting.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {([["all", "All"], ["basic", "Beginner"], ["robotics", "Robotics"], ["iot", "IoT"]] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm transition-colors",
              filter === id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={filter === id}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {list.map((p) => (
          <ProjectCard
            key={p.id}
            p={p}
            go={go}
            done={progress.projectsDone.includes(p.id)}
            complete={() => completeProject(p.id, 60)}
          />
        ))}
      </div>

      {list.length === 0 && (
        <div className="surface-card p-8 text-center text-sm text-muted-foreground">
          No projects in this category yet.
        </div>
      )}
    </div>
  )
}
