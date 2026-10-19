import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, BookOpen, Bot, Wifi, Wrench, Trophy } from "lucide-react"
import type { View } from "@/lib/view"

const STEPS: { view: View; title: string; body: string; icon: typeof BookOpen }[] = [
  { view: "learn", title: "Learning Hub", body: "Find lessons, learning paths, and concept explanations here.", icon: BookOpen },
  { view: "robotics", title: "Robotics Lab", body: "Control a virtual robot and explore simulated environments.", icon: Bot },
  { view: "iot", title: "IoT Lab", body: "Experiment with simulated sensors, device states, and automation rules.", icon: Wifi },
  { view: "projects", title: "Projects", body: "Get component lists, wiring notes, code, and troubleshooting guides.", icon: Wrench },
  { view: "progress", title: "Your Progress", body: "See completed lessons, challenges, and projects tracked here.", icon: Trophy },
]

export default function Tour({
  onNavigate,
  onExit,
}: {
  onNavigate: (v: View) => void
  onExit: (finished: boolean) => void
}) {
  const [i, setI] = useState(0)
  const step = STEPS[i]

  function go(dir: -1 | 1) {
    const next = i + dir
    if (next < 0) return
    if (next >= STEPS.length) {
      onExit(true)
      return
    }
    setI(next)
    onNavigate(STEPS[next].view)
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-start sm:pt-24">
      {/* Dim backdrop, click-through except the card */}
      <div className="pointer-events-none absolute inset-0 bg-secondary/60 backdrop-blur-[2px]" />

      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="surface-card pointer-events-auto relative w-full max-w-sm space-y-4 p-5 glow-primary"
          role="dialog"
          aria-label={`Tour step ${i + 1} of ${STEPS.length}`}
        >
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-none bg-primary/15 text-primary">
              <step.icon className="size-5" aria-hidden />
            </span>
            <div>
              <p className="font-mono text-[11px] text-muted-foreground">
                Step {i + 1} of {STEPS.length}
              </p>
              <h2 className="font-display font-semibold">{step.title}</h2>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{step.body}</p>

          {/* progress dots */}
          <div className="flex gap-1.5" aria-hidden>
            {STEPS.map((_, j) => (
              <span key={j} className={`h-1.5 flex-1 rounded-full ${j <= i ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>

          <div className="flex items-center justify-between gap-2">
            <Button variant="ghost" size="sm" onClick={() => onExit(false)}>Skip Tour</Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => go(-1)} disabled={i === 0} aria-label="Back">
                <ArrowLeft aria-hidden />
              </Button>
              <Button size="sm" onClick={() => go(1)}>
                {i === STEPS.length - 1 ? "Finish Tour" : "Next"} <ArrowRight aria-hidden />
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
