import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { componentLibrary, componentCategories, type ComponentEntry } from "@/data/hardware"
import { cn } from "@/lib/utils"

function ComponentIcon({ id, category }: { id: string; category: ComponentEntry["category"] }) {
  const c = "size-6 text-primary"
  switch (id) {
    case "resistor":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M2 12h4" />
          <path d="M4 12l1-3 2 6 2-6 2 6 2-6 2 6 1-3" />
          <path d="M18 12h4" />
          <rect x="7" y="9" width="2" height="6" fill="#d97706" stroke="none" />
          <rect x="11" y="9" width="2" height="6" fill="#1e3a8a" stroke="none" />
          <rect x="15" y="9" width="2" height="6" fill="#92400e" stroke="none" />
        </svg>
      )
    case "led":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M12 2v4" />
          <path d="M8 6h8l-4 8z" fill="currentColor" opacity="0.3" />
          <path d="M8 6h8l-4 8z" />
          <path d="M8 14h8" />
          <path d="M10 14v4M14 14v4" />
          <path d="M6 4l2 2M18 4l-2 2" stroke="#facc15" />
        </svg>
      )
    case "capacitor":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M2 12h8" />
          <path d="M10 6v12" />
          <path d="M14 6v12" />
          <path d="M14 12h8" />
        </svg>
      )
    case "diode":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M2 12h8" />
          <path d="M10 6l8 6-8 6z" fill="currentColor" opacity="0.3" />
          <path d="M10 6l8 6-8 6z" />
          <path d="M18 6v12" />
          <path d="M20 12h2" />
        </svg>
      )
    case "transistor":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <circle cx="12" cy="12" r="6" />
          <path d="M6 8l6 4-6 4" />
          <path d="M18 8v8" />
          <path d="M12 6v2M12 16v2" />
        </svg>
      )
    case "ldr":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <circle cx="12" cy="12" r="5" />
          <path d="M12 7v10M7 12h10" />
          <path d="M4 4l2 2M20 4l-2 2" stroke="#facc15" />
        </svg>
      )
    case "hc-sr04":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="2" y="8" width="20" height="8" rx="1" />
          <circle cx="7" cy="12" r="3" />
          <circle cx="17" cy="12" r="3" />
          <path d="M7 5v3M17 5v3" />
        </svg>
      )
    case "dht11":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="6" y="4" width="12" height="16" rx="2" />
          <circle cx="12" cy="8" r="2" />
          <path d="M9 12h6M9 15h6M9 18h4" />
        </svg>
      )
    case "ir":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="4" y="6" width="16" height="12" rx="2" />
          <circle cx="8" cy="12" r="2" fill="#ef4444" stroke="none" />
          <circle cx="16" cy="12" r="2" fill="#3b82f6" stroke="none" />
        </svg>
      )
    case "servo":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="4" y="8" width="16" height="8" rx="1" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 12l3-2" />
        </svg>
      )
    case "dc-motor":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 4v-2M12 20v2M4 12h-2M20 12h2" />
        </svg>
      )
    case "l298n":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M6 8h12M6 12h12M6 16h8" />
        </svg>
      )
    case "relay":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="4" y="6" width="16" height="12" rx="2" />
          <path d="M8 10h2l2 4h2" />
          <circle cx="8" cy="10" r="1" fill="currentColor" />
        </svg>
      )
    case "buzzer":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M8 8l-4 2v4l4 2z" />
          <path d="M8 6v12" />
          <path d="M12 8c2 1 2 7 0 8" />
          <path d="M15 6c3 2 3 10 0 12" />
        </svg>
      )
    case "esp32":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 7h8M8 11h8M8 15h5" />
          <circle cx="12" cy="19" r="1" fill="#22c55e" />
        </svg>
      )
    case "arduino-uno":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M6 8h4M6 12h4M6 16h4M14 8h6M14 12h6" />
        </svg>
      )
    case "battery":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="6" y="4" width="12" height="16" rx="2" />
          <path d="M9 8h6M9 12h6M9 16h3" />
          <path d="M12 2v2M12 20v2" />
          <text x="12" y="11" textAnchor="middle" fontSize="4" fill="currentColor">+</text>
        </svg>
      )
    // Fallback to category-based icons
    default:
      switch (category) {
        case "module":
          return (
            <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M7 9h10M7 13h10M7 17h6" />
            </svg>
          )
        case "passive":
          return (
            <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M3 12h18" />
            </svg>
          )
        case "input":
          return (
            <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <circle cx="12" cy="12" r="6" />
            </svg>
          )
        case "output":
          return (
            <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.3" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          )
        default:
          return null
      }
  }
}

const CATEGORY_LABEL: Record<ComponentEntry["category"], string> = {
  module: "Boards",
  power: "Power",
  passive: "Passive",
  semiconductor: "Semiconductors",
  input: "Sensors",
  output: "Actuators",
  control: "Drivers",
}

export default function Components() {
  const [q, setQ] = useState("")
  const [cat, setCat] = useState<string>("all")
  const [selected, setSelected] = useState<ComponentEntry | null>(null)

  const list = componentLibrary.filter((c) => {
    const matchesQ =
      !q ||
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.whatItDoes.toLowerCase().includes(q.toLowerCase())
    const matchesCat = cat === "all" || c.category === cat
    return matchesQ && matchesCat
  })

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Components</h1>
          <p className="text-sm text-muted-foreground">Reference for common parts. Click for details.</p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="pl-9" aria-label="Search components" />
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCat("all")}
          className={cn(
            "rounded-none border-2 px-3 py-1 text-sm font-medium transition-colors",
            cat === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-muted",
          )}
          aria-pressed={cat === "all"}
        >
          All ({componentLibrary.length})
        </button>
        {componentCategories.map((c) => {
          const count = componentLibrary.filter((x) => x.category === c.id).length
          if (count === 0) return null
          return (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={cn(
                "rounded-none border-2 px-3 py-1 text-sm font-medium transition-colors",
                cat === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-muted",
              )}
              aria-pressed={cat === c.id}
            >
              {c.label} ({count})
            </button>
          )
        })}
      </div>

      {list.length === 0 ? (
        <div className="border-2 border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No components match. Try "sensor", "motor", or "resistor".
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className="flex flex-col gap-2 border-2 border-border bg-card p-4 text-left transition-colors hover:border-primary"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center border-2 border-border bg-background">
                  <ComponentIcon id={c.id} category={c.category} />
                </span>
                <div className="min-w-0">
                  <h2 className="font-display font-bold leading-tight">{c.name}</h2>
                  <p className="font-mono text-[10px] uppercase text-muted-foreground">{CATEGORY_LABEL[c.category]}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{c.whatItDoes}</p>
              <div className="mt-auto flex flex-wrap gap-1">
                {c.pinout.slice(0, 3).map((pin) => (
                  <span key={pin} className="border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {pin}
                  </span>
                ))}
                {c.pinout.length > 3 && (
                  <span className="border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    +{c.pinout.length - 3}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg border-2 border-border bg-card shadow-[8px_8px_0_0_#0b0b0c]">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <span className="grid size-12 shrink-0 place-items-center border-2 border-border bg-background">
                    <ComponentIcon id={selected.id} category={selected.category} />
                  </span>
                  <div>
                    <DialogTitle className="font-display text-xl font-bold">{selected.name}</DialogTitle>
                    <DialogDescription className="font-mono text-xs uppercase text-muted-foreground">{CATEGORY_LABEL[selected.category]}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-primary">What it does</p>
                  <p className="leading-relaxed text-muted-foreground">{selected.whatItDoes}</p>
                </div>

                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-primary">Key spec</p>
                  <p className="text-muted-foreground">{selected.keySpec}</p>
                </div>

                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-primary">Pinout</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.pinout.map((pin) => (
                      <span key={pin} className="border border-border bg-background px-2 py-1 font-mono text-xs text-muted-foreground">
                        {pin}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-2 border-primary bg-primary/5 p-3">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-primary">Tip</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{selected.tip}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}