import { useState } from "react"
import { motion } from "motion/react"
import { Search, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { componentLibrary, componentCategories } from "@/data/hardware"
import { cn } from "@/lib/utils"

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
                <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-border bg-background/50 font-mono text-sm text-primary">
                  {c.symbol}
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
