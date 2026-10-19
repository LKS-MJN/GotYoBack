import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Bot, CircuitBoard, Wrench, Target, Check, ArrowRight, ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LEVEL_OPTIONS,
  INTEREST_OPTIONS,
  GOAL_OPTIONS,
  STYLE_OPTIONS,
  buildRoadmap,
  type Preferences,
} from "@/lib/preferences"

const ENTRY_POINTS = [
  { icon: CircuitBoard, title: "Learn", desc: "Understand concepts through guided lessons." },
  { icon: Bot, title: "Simulate", desc: "Experiment with virtual sensors, circuits, and robots." },
  { icon: Wrench, title: "Build", desc: "Follow practical projects step by step." },
  { icon: Target, title: "Challenge", desc: "Test yourself through interactive missions." },
]

// totalSteps covers level, interests, goal, style (welcome is a pre-step).
const TOTAL_STEPS = 4

export default function Onboarding({
  onComplete,
  onSkip,
}: {
  onComplete: (p: Preferences) => void
  onSkip: () => void
}) {
  const [step, setStep] = useState(0) // 0 = welcome, 1..4 = questions, 5 = roadmap
  const [level, setLevel] = useState<Preferences["level"]>(null)
  const [interests, setInterests] = useState<string[]>([])
  const [notSure, setNotSure] = useState(false)
  const [goal, setGoal] = useState("")
  const [styles, setStyles] = useState<string[]>([])
  const [error, setError] = useState("")

  const prefs: Preferences = useMemo(
    () => ({
      onboarded: true,
      tourDone: false,
      level,
      interests: notSure ? [] : interests,
      goal,
      styles: styles as Preferences["styles"],
      lastActivity: null,
    }),
    [level, interests, notSure, goal, styles],
  )

  const roadmap = useMemo(
    () =>
      buildRoadmap(prefs, (pathId) => {
        // First real lesson of a path resolved lazily to keep this self-contained.
        const map: Record<string, { id: string; title: string; minutes: number }> = {
          electronics: { id: "elec-ohm", title: "Ohm's Law", minutes: 8 },
          arduino: { id: "ard-intro", title: "What Is a Microcontroller?", minutes: 7 },
          sensors: { id: "sen-ultrasonic", title: "Ultrasonic Distance Sensor", minutes: 10 },
          robotics: { id: "rob-drive", title: "Robot Chassis and Drive Systems", minutes: 8 },
          esp32: { id: "esp-intro", title: "ESP32 Architecture and GPIO", minutes: 9 },
          iot: { id: "iot-intro", title: "What Is the Internet of Things?", minutes: 7 },
          projects: { id: "proj-night-lamp", title: "Automatic Night Lamp", minutes: 15 },
        }
        return map[pathId] ?? null
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prefs.level, prefs.interests, prefs.goal, prefs.styles],
  )

  function toggleInterest(id: string) {
    setNotSure(false)
    setInterests((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function toggleStyle(id: string) {
    setStyles((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function next() {
    setError("")
    if (step === 1 && !level) return setError("Choose the option that fits you best.")
    if (step === 2 && interests.length === 0 && !notSure) return setError("Pick at least one interest, or choose Not sure yet.")
    if (step === 3 && !goal) return setError("Choose a goal, or go back and pick an interest to skip this.")
    if (step === 4 && styles.length === 0) return setError("Select at least one learning style.")
    setStep((s) => s + 1)
  }

  const stepLabel = step === 0 ? "" : step <= TOTAL_STEPS ? `Step ${step} of ${TOTAL_STEPS}` : ""

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Step indicator */}
        {stepLabel && (
          <div className="mb-6 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-primary"
                animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="font-mono text-xs text-muted-foreground">{stepLabel}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ---------- Welcome ---------- */}
          {step === 0 && (
            <motion.div key="welcome" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Sparkles className="size-3.5" aria-hidden /> No hardware required
                </span>
                <h1 className="font-display text-[clamp(2rem,6vw,3rem)] font-bold leading-tight tracking-tight">
                  Your Journey into Robotics Starts Here
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  Learn electronics, program microcontrollers, experiment with virtual hardware, and build
                  intelligent robotic and IoT systems.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {ENTRY_POINTS.map((e, i) => (
                  <motion.div
                    key={e.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="flex items-start gap-3 border-2 border-border bg-card p-5"
                  >
                    <div>
                      <h2 className="font-display font-semibold">{e.title}</h2>
                      <p className="text-sm text-muted-foreground">{e.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={() => setStep(1)}>
                  Let's Get Started <ArrowRight aria-hidden />
                </Button>
                <Button size="lg" variant="outline" onClick={onSkip}>
                  Explore the Lab First
                </Button>
              </div>
            </motion.div>
          )}

          {/* ---------- Step 1: Experience level ---------- */}
          {step === 1 && (
            <motion.div key="level" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h1 className="font-display text-3xl font-bold tracking-tight">
                How familiar are you with electronics and robotics?
              </h1>
              <div className="grid gap-3">
                {LEVEL_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setLevel(opt.id)}
                    className={cn(
                      "surface-card flex items-center justify-between gap-3 p-5 text-left transition-colors hover:border-primary/40",
                      level === opt.id && "border-primary ring-1 ring-primary/40",
                    )}
                    aria-pressed={level === opt.id}
                  >
                    <div>
                      <p className="font-display font-semibold">{opt.title}</p>
                      <p className="text-sm text-muted-foreground">{opt.desc}</p>
                    </div>
                    {level === opt.id && <Check className="size-5 shrink-0 text-primary" aria-hidden />}
                  </button>
                ))}
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Nav onBack={() => setStep(0)} onNext={next} nextLabel="Continue" />
            </motion.div>
          )}

          {/* ---------- Step 2: Interests ---------- */}
          {step === 2 && (
            <motion.div key="interests" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight">What would you like to learn first?</h1>
                <p className="text-muted-foreground">Select any that interest you. You can pick more than one.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {INTEREST_OPTIONS.map((opt) => {
                  const active = interests.includes(opt.id) && !notSure
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleInterest(opt.id)}
                      className={cn(
                        "surface-card flex items-center justify-between gap-3 p-4 text-left transition-colors hover:border-primary/40",
                        active && "border-primary ring-1 ring-primary/40",
                      )}
                      aria-pressed={active}
                    >
                      <div>
                        <p className="font-medium">{opt.title}</p>
                        <p className="text-sm text-muted-foreground">{opt.desc}</p>
                      </div>
                      <span className={cn("grid size-5 shrink-0 place-items-center rounded border", active ? "border-primary bg-primary" : "border-border")}>
                        {active && <Check className="size-3.5 text-primary-foreground" aria-hidden />}
                      </span>
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => { setNotSure((v) => !v); setInterests([]) }}
                className={cn("surface-card w-full p-4 text-left text-sm transition-colors hover:border-primary/40", notSure && "border-primary ring-1 ring-primary/40")}
                aria-pressed={notSure}
              >
                <span className="font-medium">Not sure yet</span>
                <span className="text-muted-foreground">. We will recommend a beginner-friendly path.</span>
              </button>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Nav onBack={() => setStep(1)} onNext={next} nextLabel="Continue" />
            </motion.div>
          )}

          {/* ---------- Step 3: Goal ---------- */}
          {step === 3 && (
            <motion.div key="goal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h1 className="font-display text-3xl font-bold tracking-tight">What would you like to achieve?</h1>
              <div className="grid gap-2.5">
                {GOAL_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setGoal(opt.id)}
                    className={cn(
                      "surface-card flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:border-primary/40",
                      goal === opt.id && "border-primary ring-1 ring-primary/40",
                    )}
                    aria-pressed={goal === opt.id}
                  >
                    <span>{opt.title}</span>
                    {goal === opt.id && <Check className="size-4 text-primary" aria-hidden />}
                  </button>
                ))}
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Nav onBack={() => setStep(2)} onNext={next} nextLabel="Continue" />
            </motion.div>
          )}

          {/* ---------- Step 4: Learning style ---------- */}
          {step === 4 && (
            <motion.div key="style" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight">How do you prefer to learn?</h1>
                <p className="text-muted-foreground">Pick one or more. We recommend a balanced mix.</p>
              </div>
              <div className="grid gap-3">
                {STYLE_OPTIONS.map((opt) => {
                  const active = styles.includes(opt.id)
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleStyle(opt.id)}
                      className={cn(
                        "surface-card flex items-center justify-between gap-3 p-5 text-left transition-colors hover:border-primary/40",
                        active && "border-primary ring-1 ring-primary/40",
                      )}
                      aria-pressed={active}
                    >
                      <div>
                        <p className="font-display font-semibold">{opt.title}</p>
                        <p className="text-sm text-muted-foreground">{opt.desc}</p>
                      </div>
                      <span className={cn("grid size-5 shrink-0 place-items-center rounded border", active ? "border-primary bg-primary" : "border-border")}>
                        {active && <Check className="size-3.5 text-primary-foreground" aria-hidden />}
                      </span>
                    </button>
                  )
                })}
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Nav onBack={() => setStep(3)} onNext={next} nextLabel="Create My Learning Path" />
            </motion.div>
          )}

          {/* ---------- Step 5: Roadmap ---------- */}
          {step === 5 && (
            <motion.div key="roadmap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-7">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Sparkles className="size-3.5" aria-hidden /> Ready
                </span>
                <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  Your GotYoBack Learning Path Is Ready!
                </h1>
                <p className="text-muted-foreground">
                  {level === "beginner" && "Great starting point: we'll begin with the fundamentals."}
                  {level === "some" && "You've got a base, so we will jump into building quickly."}
                  {level === "experienced" && "We'll move fast and focus on integration and control."}
                  {!level && "Here's a balanced path to get you building."}
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {interests.slice(0, 5).map((id) => (
                    <span key={id} className="rounded-full border border-border bg-muted px-2.5 py-1 text-muted-foreground">
                      {INTEREST_OPTIONS.find((o) => o.id === id)?.title}
                    </span>
                  ))}
                  {notSure && <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-muted-foreground">Beginner-friendly path</span>}
                </div>
              </div>

              <ol className="space-y-3">
                {roadmap.map((stage, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="surface-card flex items-start gap-4 p-4"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/15 font-display text-sm font-bold text-primary">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-display font-semibold">{stage.title}</p>
                      <p className="text-sm text-muted-foreground">{stage.desc}</p>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">{stage.minutes} min</span>
                  </motion.li>
                ))}
              </ol>

              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={() => onComplete(prefs)}>
                  Start My First Lesson <ArrowRight aria-hidden />
                </Button>
                <Button size="lg" variant="outline" onClick={() => onComplete({ ...prefs, onboarded: true })}>
                  Explore All Lessons
                </Button>
                <Button size="lg" variant="ghost" onClick={() => setStep(1)}>
                  Edit My Preferences
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Nav({ onBack, onNext, nextLabel }: { onBack: () => void; onNext: () => void; nextLabel: string }) {
  return (
    <div className="flex items-center justify-between gap-3 pt-1">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft aria-hidden /> Back
      </Button>
      <Button onClick={onNext}>
        {nextLabel} <ArrowRight aria-hidden />
      </Button>
    </div>
  )
}
