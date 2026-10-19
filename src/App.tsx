import { useCallback, useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Bot, ShieldCheck, Cloud, CloudOff, RotateCcw, MapPin } from "lucide-react"
import { useProgress } from "@/hooks/useProgress"
import { AuthProvider, useAuth } from "@/providers/AuthProvider"
import { cloudEnabled } from "@/lib/supabase"
import { loadPreferences, savePreferences, type Preferences } from "@/lib/preferences"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { View } from "@/lib/view"
import Tour from "@/components/Tour"
import Onboarding from "@/onboarding/Onboarding"
import Home from "@/views/Home"
import Learn from "@/views/Learn"
import LessonView from "@/views/LessonView"
import RoboticsLab from "@/views/RoboticsLab"
import IoTLab from "@/views/IoTLab"
import Projects from "@/views/Projects"
import Components from "@/views/Components"
import ProgressPage from "@/views/Progress"
import { allLessons } from "@/data/curriculum"

const NAV: { id: View; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "learn", label: "Learn" },
  { id: "robotics", label: "Robotics Lab" },
  { id: "iot", label: "IoT Lab" },
  { id: "projects", label: "Projects" },
  { id: "components", label: "Components" },
  { id: "progress", label: "Progress" },
]

function Shell() {
  const [view, setView] = useState<View>("home")
  const [activeLesson, setActiveLesson] = useState<string | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [touring, setTouring] = useState(false)
  const [prefs, setPrefs] = useState<Preferences>(() => loadPreferences())
  const api = useProgress()
  const { ready, signedIn, isGuest } = useAuth()

  // First-time users get onboarding. Returning users land on the dashboard.
  useEffect(() => {
    if (!prefs.onboarded) setShowOnboarding(true)
  }, [prefs.onboarded])

  const updatePrefs = useCallback((patch: Partial<Preferences>) => {
    setPrefs((p) => {
      const next = { ...p, ...patch }
      savePreferences(next)
      return next
    })
  }, [])

  const go = useCallback((v: View) => {
    setView(v)
    if (v !== "lesson") setActiveLesson(null)
    window.scrollTo({ top: 0 })
  }, [])

  const openLesson = useCallback((id: string) => {
    setActiveLesson(id)
    setView("lesson")
    updatePrefs({ lastActivity: { view: "lesson", id } })
    window.scrollTo({ top: 0 })
  }, [updatePrefs])

  function completeOnboarding(p: Preferences) {
    savePreferences(p)
    setPrefs(p)
    setShowOnboarding(false)
    // Route into the first recommended lesson.
    setView("learn")
  }

  function skipOnboarding() {
    updatePrefs({ onboarded: true })
    setShowOnboarding(false)
  }

  function editPrefs() {
    setShowOnboarding(true)
  }

  // Overall completion across lessons and projects.
  const totalItems = allLessons.length + 4 // lessons + projects
  const doneItems = api.progress.lessonsCompleted.length + api.progress.projectsDone.length
  const percent = Math.min(100, Math.round((doneItems / totalItems) * 100))

  if (showOnboarding) {
    return <Onboarding onComplete={completeOnboarding} onSkip={skipOnboarding} />
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
          <button onClick={() => go("home")} className="flex shrink-0 items-center gap-2.5 font-display text-lg font-bold tracking-tight" aria-label="RoboLab home">
            <span className="glow-primary grid size-8 place-items-center rounded-lg bg-primary">
              <Bot className="size-4.5 text-primary-foreground" aria-hidden />
            </span>
            <span className="hidden sm:inline">Robo<span className="text-primary">Lab</span></span>
          </button>

          <nav aria-label="Main" className="min-w-0">
            <ul className="flex items-center gap-0.5 overflow-x-auto text-sm">
              {NAV.map((item) => {
                const active = view === item.id || (view === "lesson" && item.id === "learn")
                return (
                  <li key={item.id} className="relative">
                    <button
                      onClick={() => go(item.id)}
                      aria-current={active ? "page" : undefined}
                      className={`relative rounded-lg px-3 py-1.5 whitespace-nowrap transition-colors ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {active && (
                        <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-lg bg-accent" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                      )}
                      <span className="relative z-10">{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <span
              className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex"
              title={!cloudEnabled ? "Local mode. Add Supabase keys to enable cloud sync." : signedIn ? (isGuest ? "Saved to your guest account." : "Synced to your account.") : "Connecting..."}
            >
              {!cloudEnabled ? <CloudOff className="size-3.5" aria-hidden /> : !ready ? <Cloud className="size-3.5 animate-pulse" aria-hidden /> : <Cloud className="size-3.5 text-primary" aria-hidden />}
              {!cloudEnabled ? "Local" : !ready ? "Syncing" : "Synced"}
            </span>
            <span className="rounded-lg bg-accent px-2.5 py-1 font-display text-sm font-semibold text-accent-foreground">{api.progress.xp} XP</span>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Reset progress"><RotateCcw aria-hidden /></Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset all progress?</DialogTitle>
                  <DialogDescription>This clears your XP, completed lessons, and projects on this device.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {}}>Cancel</Button>
                  <Button variant="destructive" onClick={() => api.resetProgress()}>Reset everything</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={view === "lesson" ? `lesson-${activeLesson}` : view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {view === "home" && (
              <Home {...api} prefs={prefs} percent={percent} go={go} openLesson={openLesson} startTour={() => setTouring(true)} editPrefs={editPrefs} />
            )}
            {view === "learn" && <Learn {...api} openLesson={openLesson} />}
            {view === "lesson" && activeLesson && (
              <LessonView {...api} lessonId={activeLesson} back={() => go("learn")} go={go} />
            )}
            {view === "robotics" && <RoboticsLab {...api} />}
            {view === "iot" && <IoTLab {...api} />}
            {view === "projects" && <Projects {...api} go={go} />}
            {view === "components" && <Components />}
            {view === "progress" && (
              <ProgressPage {...api} prefs={prefs} percent={percent} openLesson={openLesson} go={go} editPrefs={editPrefs} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-1 px-4 text-center text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5 font-display font-medium text-foreground">
            <ShieldCheck className="size-4 text-primary" aria-hidden /> RoboLab
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5" aria-hidden /> Robotics, Electronics & IoT, learned by doing
          </span>
        </div>
      </footer>

      {touring && (
        <Tour
          onNavigate={go}
          onExit={(finished) => {
            setTouring(false)
            if (finished) updatePrefs({ tourDone: true })
          }}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  )
}
