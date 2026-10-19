import { useState } from "react"
import { motion } from "motion/react"
import { Search, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { componentLibrary, componentCategories, type ComponentEntry } from "@/data/hardware"
import { cn } from "@/lib/utils"

function ComponentIcon({ category }: { category: ComponentEntry["category"] }) {
  const common = "size-6 text-primary"
  switch (category) {
    case "module":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="7" cy="9" r="1" fill="currentColor" />
          <circle cx="17" cy="9" r="1" fill="currentColor" />
          <path d="M7 15h10" />
        </svg>
      )
    case "power":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
        </svg>
      )
    case "passive":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M3 12h4l2-4 4 8 2-4h6" />
        </svg>
      )
    case "semiconductor":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M6 6l12 12M6 18L18 6" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    case "input":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <circle cx="12" cy="12" r="6" />
          <path d="M12 6v2M12 16v2M6 12h2M16 12h2" />
        </svg>
      )
    case "output":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      )
    case "control":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      )
    default:
      return null
  }
}
export default function Components() {
  const [q, setQ] = useState("")
  const [cat, setCat] = useState<string>("all")

  const list = componentLibrary.filter((c) => {
    const matchesQ = !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.whatItDoes.toLowerCase().includes(q.toLowerCase())
    const matchesCat = cat === "all" || c.category === cat
    return matchesQ && matchesCat
  })

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <div className="space-y-1.5">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Components Library</h1>
          <p className="text-muted-foreground">The parts every circuit and robot is built from.</p>
        </div>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search components..." className="pl-9" aria-label="Search components" />
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCat("all")}
          className={cn("rounded-lg border px-3 py-1.5 text-sm transition-colors", cat === "all" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground")}
          aria-pressed={cat === "all"}
        >
          All
        </button>
        {componentCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={cn("rounded-lg border px-3 py-1.5 text-sm transition-colors", cat === c.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground")}
            aria-pressed={cat === c.id}
          >
            {c.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="surface-card p-8 text-center text-sm text-muted-foreground">
          No components match that search.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              className="surface-card flex flex-col gap-3 p-5"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-border bg-background/50">
                  <ComponentIcon category={c.category} />
                </span>
                <div className="min-w-0">
                  <h2 className="font-display font-semibold">{c.name}</h2>
                  <p className="font-mono text-[11px] uppercase text-muted-foreground">{c.category}</p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">{c.whatItDoes}</p>

              <div className="space-y-1.5 text-xs">
                <p><span className="text-muted-foreground">Key spec: </span><span className="text-foreground/85">{c.keySpec}</span></p>
                <div className="flex flex-wrap gap-1.5">
                  {c.pinout.map((pin) => (
                    <span key={pin} className="rounded border border-border bg-background/50 px-1.5 py-0.5 font-mono text-muted-foreground">
                      {pin}
                    </span>
                  ))}
                </div>
              </div>

              <p className="mt-auto flex gap-2 rounded-lg border border-primary/20 bg-primary/5 p-2.5 text-xs leading-relaxed text-muted-foreground">
                <Info className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                <span>{c.tip}</span>
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
