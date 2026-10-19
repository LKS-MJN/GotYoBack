import { useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, Lightbulb, Fan, Siren, Droplets, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createIoT, tickIoT, resetIoT, type IoTSim } from "@/lib/sim/iot"
import { cn } from "@/lib/utils"
import type { ProgressApi } from "@/hooks/useProgress"
import { useState } from "react"

const ICONS = { light: Lightbulb, fan: Fan, alarm: Siren, pump: Droplets }

function Spark({ data, max }: { data: number[]; max: number }) {
  if (data.length < 2) return <div className="h-10" />
  const w = 100
  const h = 32
  const step = w / (data.length - 1)
  const pts = data
    .map((v, i) => `${(i * step).toFixed(1)},${(h - (v / max) * h).toFixed(1)}`)
    .join(" ")
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-10 w-full" aria-hidden>
      <polyline points={pts} fill="none" stroke="var(--sim-target)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export default function IoTLab({ recordExperiment }: ProgressApi) {
  const [sim, setSim] = useState<IoTSim>(() => createIoT())
  const [running, setRunning] = useState(false)
  const [viewMode, setViewMode] = useState<"text" | "visual">("text")
  const counted = useRef(false)

  useEffect(() => {
    if (!running) return
    const t = setTimeout(() => setSim((s) => tickIoT(s)), 700)
    return () => clearTimeout(t)
  }, [running, sim])

  // Count first completed viewing as an experiment.
  useEffect(() => {
    if (sim.tick >= 5 && !counted.current) {
      counted.current = true
      recordExperiment()
    }
  }, [sim.tick, recordExperiment])

  function manualSet(sensorId: string, value: number) {
    setSim((s) => ({
      ...s,
      sensors: s.sensors.map((x) => (x.id === sensorId ? { ...x, value } : x)),
    }))
  }

  function toggleRule(ruleId: string) {
    setSim((s) => ({ ...s, rules: s.rules.map((r) => (r.id === ruleId ? { ...r, turnOn: !r.turnOn } : r)) }))
  }

  const activeRules = sim.rules.filter((r) => {
    const sv = sim.sensors.find((s) => s.id === r.sensorId)?.value ?? 0
    return r.op === ">" ? sv > r.threshold : sv < r.threshold
  }).length

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">IoT Lab</h1>
          <p className="text-muted-foreground">
            A simulated smart room. Change conditions and watch automation rules fire.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border bg-muted/40 p-0.5">
            <button
              onClick={() => setViewMode("text")}
              className={`rounded-md px-2.5 py-1 text-xs transition-colors ${viewMode === "text" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              aria-pressed={viewMode === "text"}
            >
              Text
            </button>
            <button
              onClick={() => setViewMode("visual")}
              className={`rounded-md px-2.5 py-1 text-xs transition-colors ${viewMode === "visual" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              aria-pressed={viewMode === "visual"}
            >
              Visual
            </button>
          </div>
          <Button onClick={() => setRunning((r) => !r)} className="min-w-24">
            {running ? <><Pause aria-hidden /> Pause</> : <><Play aria-hidden /> Run</>}
          </Button>
          <Button variant="outline" onClick={() => { setSim(resetIoT()); counted.current = false }} aria-label="Reset">
            <RotateCcw aria-hidden /> Reset
          </Button>
        </div>
      </header>

      <p className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs text-muted-foreground">
        Simulated in-browser. No real hardware or cloud.
      </p>

      {/* Sensor cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sim.sensors.map((s) => {
          const pct = s.max === s.min ? 0 : (s.value - s.min) / (s.max - s.min)
          const r = 30
          const circ = 2 * Math.PI * r
          const offset = circ * (1 - pct)
          return (
            <div key={s.id} className="surface-card p-4">
              <div className="flex items-baseline justify-between">
                <p className="text-sm text-muted-foreground">{s.name}</p>
                <span className="font-display text-lg font-bold text-primary">
                  {s.value}
                  <span className="ml-0.5 text-xs font-normal text-muted-foreground">{s.unit}</span>
                </span>
              </div>
              {viewMode === "visual" ? (
                <div className="my-2 flex items-center justify-center">
                  <svg viewBox="0 0 80 80" className="h-24 w-24" aria-hidden>
                    <circle cx="40" cy="40" r={r} fill="none" stroke="var(--muted)" strokeWidth="6" />
                    <circle
                      cx="40"
                      cy="40"
                      r={r}
                      fill="none"
                      stroke="var(--sim-target)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={circ}
                      strokeDashoffset={offset}
                      transform="rotate(-90 40 40)"
                      style={{ transition: "stroke-dashoffset 0.3s ease" }}
                    />
                    <text x="40" y="44" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>
                      {s.value}
                    </text>
                  </svg>
                </div>
              ) : (
                <Spark data={sim.series[s.id] ?? []} max={s.max} />
              )}
              <input
                type="range"
                min={s.min}
                max={s.max}
                value={s.value}
                onChange={(e) => manualSet(s.id, Number(e.target.value))}
                className="mt-1 w-full accent-[var(--sim-target)]"
                aria-label={`${s.name} value`}
              />
            </div>
          )
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        {/* Device states */}
        <div className="surface-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display font-semibold">Device states</h3>
            <span className="text-xs text-muted-foreground">{activeRules} rule(s) matching now</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {sim.devices.map((d) => {
              const Icon = ICONS[d.icon]
              return (
                <div
                  key={d.id}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                    d.on ? "border-sim-warn/50 bg-sim-warn/10" : "border-border bg-background/40",
                  )}
                >
                  <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", d.on ? "bg-sim-warn/20 text-sim-warn" : "bg-muted text-muted-foreground")}>
                    <Icon className={cn("size-4.5", d.on && "animate-pulse")} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{d.name}</p>
                    <p className={cn("font-mono text-xs", d.on ? "text-sim-warn" : "text-muted-foreground")}>
                      {d.on ? "ON" : "OFF"}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Automation rules */}
        <div className="surface-card p-5">
          <h3 className="mb-4 font-display font-semibold">Automation rules</h3>
          <ul className="space-y-2.5">
            {sim.rules.map((r) => {
              const sensor = sim.sensors.find((s) => s.id === r.sensorId)
              const device = sim.devices.find((d) => d.id === r.deviceId)
              const sv = sensor?.value ?? 0
              const matching = r.op === ">" ? sv > r.threshold : sv < r.threshold
              return (
                <li key={r.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 p-3">
                  <div className="min-w-0 font-mono text-xs leading-relaxed">
                    <span className="text-muted-foreground">IF </span>
                    <span className="text-foreground">{sensor?.name}</span>
                    <span className="text-primary"> {r.op} {r.threshold}</span>
                    <span className="text-muted-foreground"> THEN </span>
                    <span className="text-foreground">{device?.name} {r.turnOn ? "ON" : "OFF"}</span>
                    <div className={cn("mt-1 font-sans text-[11px]", matching ? "text-sim-ok" : "text-muted-foreground")}>
                      {matching ? "Condition true now" : "Condition false"}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleRule(r.id)}
                    className={cn(
                      "h-5 w-9 shrink-0 rounded-full transition-colors",
                      r.turnOn ? "bg-sim-ok" : "bg-muted",
                    )}
                    role="switch"
                    aria-checked={r.turnOn}
                    aria-label={`Enable rule for ${device?.name}`}
                  >
                    <span className={cn("block size-4 rounded-full bg-white transition-transform", r.turnOn ? "translate-x-4" : "translate-x-0.5")} />
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Data flow strip (sensor-to-action) */}
      <div className="surface-card p-5">
        <h3 className="mb-3 font-display font-semibold">Sensor to action</h3>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {[
            { l: "Physical", v: `${sim.sensors[0].value} °C` },
            { l: "Sensor", v: "DHT11" },
            { l: "Signal", v: "digital" },
            { l: "Controller", v: "ESP32" },
            { l: "Logic", v: activeRules > 0 ? "rule matched" : "no match" },
            { l: "Output", v: sim.devices.some((d) => d.on) ? "actuator ON" : "idle" },
          ].map((st, i, arr) => (
            <span key={st.l} className="flex items-center gap-2">
              <span className="rounded-lg border border-border bg-background/50 px-3 py-2">
                <span className="block text-muted-foreground">{st.l}</span>
                <span className="block font-mono text-foreground">{st.v}</span>
              </span>
              {i < arr.length - 1 && <span className="text-primary" aria-hidden>›</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Event log */}
      <div className="surface-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display font-semibold">Event log</h3>
          <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <Zap className="size-3.5 text-primary" aria-hidden /> tick {sim.tick}
          </span>
        </div>
        {sim.log.length === 0 ? (
          <p className="text-sm text-muted-foreground">No events yet. Run the simulation or nudge a sensor value.</p>
        ) : (
          <ul className="max-h-52 space-y-1.5 overflow-y-auto font-mono text-xs">
            {sim.log
              .slice()
              .reverse()
              .map((e, i) => (
                <li key={i} className="leading-relaxed">
                  <span className="text-muted-foreground">t{e.tick}</span>{" "}
                  <span className="text-foreground/85">{e.note}</span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  )
}
