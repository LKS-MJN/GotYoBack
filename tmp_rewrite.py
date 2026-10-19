import * as fs from "fs";
const content = `// IoT smart-environment simulation engine.
// Sensors stay stable by default. They change gradually only when a
// simulated event shifts their target. Devices turn on/off only when a
// rule genuinely fires.

export interface Sensor {
  id: string
  name: string
  unit: string
  value: number
  target: number
  min: number
  max: number
  drift: number
  stable: boolean
}

export interface Device {
  id: string
  name: string
  on: boolean
  icon: "light" | "fan" | "alarm" | "pump"
}

export interface AutoRule {
  id: string
  sensorId: string
  op: "<" | ">"
  threshold: number
  deviceId: string
  turnOn: boolean
}

export interface IoTEvent {
  tick: number
  ruleId: string
  deviceId: string
  fired: boolean
  note: string
}

export interface IoTSim {
  tick: number
  running: boolean
  sensors: Sensor[]
  devices: Device[]
  rules: AutoRule[]
  log: IoTEvent[]
  series: Record<string, number[]>
  nextEventTick: number
  motionTicksLeft: number
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export function createIoT(): IoTSim {
  return {
    tick: 0,
    running: false,
    sensors: [
      { id: "temp", name: "Temperature", unit: "°C", value: 24, target: 24, min: 10, max: 45, drift: 0.4, stable: true },
      { id: "bright", name: "Brightness", unit: "lux", value: 320, target: 320, min: 0, max: 900, drift: 12, stable: true },
      { id: "motion", name: "Motion", unit: "detected", value: 0, target: 0, min: 0, max: 1, drift: 0, stable: true },
      { id: "water", name: "Water level", unit: "%", value: 35, target: 35, min: 0, max: 100, drift: 1.5, stable: true },
    ],
    devices: [
      { id: "fan", name: "Cooling Fan", on: false, icon: "fan" },
      { id: "light", name: "Room Light", on: true, icon: "light" },
      { id: "alarm", name: "Security Alarm", on: false, icon: "alarm" },
      { id: "pump", name: "Irrigation Pump", on: false, icon: "pump" },
    ],
    rules: [
      { id: "temp-fan", sensorId: "temp", op: ">", threshold: 30, deviceId: "fan", turnOn: true },
      { id: "bright-light", sensorId: "bright", op: "<", threshold: 200, deviceId: "light", turnOn: true },
      { id: "motion-alarm", sensorId: "motion", op: ">", threshold: 0.5, deviceId: "alarm", turnOn: true },
      { id: "water-pump", sensorId: "water", op: "<", threshold: 25, deviceId: "pump", turnOn: true },
    ],
    log: [],
    series: { temp: [24], bright: [320], motion: [0], water: [35] },
    nextEventTick: 20,
    motionTicksLeft: 0,
  }
}

const EVENTS: { sensorId: string; apply: () => Partial<Sensor> }[] = [
  { sensorId: "temp", apply: () => ({ target: 32, stable: false }) },
  { sensorId: "temp", apply: () => ({ target: 18, stable: false }) },
  { sensorId: "bright", apply: () => ({ target: 500, stable: false }) },
  { sensorId: "bright", apply: () => ({ target: 120, stable: false }) },
  { sensorId: "water", apply: () => ({ target: 70, stable: false }) },
  { sensorId: "water", apply: () => ({ target: 10, stable: false }) },
]

export function tickIoT(sim: IoTSim): IoTSim {
  let motionTicksLeft = sim.motionTicksLeft

  const sensors = sim.sensors.map((s) => {
    if (s.id === "motion") {
      if (motionTicksLeft > 0) {
        motionTicksLeft--
        return { ...s, value: 1 }
      }
      return { ...s, value: 0 }
    }
    if (s.stable) return s
    const diff = s.target - s.value
    if (Math.abs(diff) <= s.drift) {
      return { ...s, value: s.target, stable: true }
    }
    const value = clamp(s.value + Math.sign(diff) * s.drift, s.min, s.max)
    return { ...s, value: Math.round(value * 10) / 10 }
  })

  let nextEventTick = sim.nextEventTick
  if (sim.tick + 1 >= nextEventTick) {
    const evt = EVENTS[Math.floor(Math.random() * EVENTS.length)]
    if (evt.sensorId === "motion") {
      motionTicksLeft = 4
    } else {
      sensors.forEach((s) => {
        if (s.id === evt.sensorId) {
          Object.assign(s, evt.apply())
        }
      })
    }
    nextEventTick = sim.tick + 1 + 15 + Math.floor(Math.random() * 25)
  }

  const bySensor = new Map(sensors.map((s) => [s.id, s.value]))
  const devices = sim.devices.map((d) => ({ ...d }))
  const deviceById = new Map(devices.map((d) => [d.id, d]))
  const log: IoTEvent[] = []
  for (const r of sim.rules) {
    const sv = bySensor.get(r.sensorId)
    if (sv === undefined) continue
    const active = r.op === ">" ? sv > r.threshold : sv < r.threshold
    const dev = deviceById.get(r.deviceId)
    if (!dev) continue
    const target = active ? r.turnOn : !r.turnOn
    if (dev.on !== target) {
      dev.on = target
      const sensor = sensors.find((s) => s.id === r.sensorId)
      log.push({ tick: sim.tick + 1, ruleId: r.id, deviceId: r.deviceId, fired: true, note: \`\${sensor?.name} \${r.op} \${r.threshold}: \${dev.name} turned \${target ? "ON" : "OFF"}.\` })
    }
  }

  const series: Record<string, number[]> = { ...sim.series }
  for (const s of sensors) {
    const arr = [...(series[s.id] ?? []), s.value]
    series[s.id] = arr.slice(-40)
  }

  return {
    ...sim,
    tick: sim.tick + 1,
    sensors,
    devices: devices.map((d) => deviceById.get(d.id)!),
    log: [...sim.log, ...log].slice(-60),
    series,
    nextEventTick,
    motionTicksLeft,
  }
}

export function setSensorValue(sim: IoTSim, id: string, value: number): IoTSim {
  return {
    ...sim,
    sensors: sim.sensors.map((s) =>
      s.id === id ? { ...s, value, target: value, stable: true } : s,
    ),
  }
}

export function resetIoT(): IoTSim {
  return createIoT()
}
`;
fs.writeFileSync("src/lib/sim/iot.ts", content, "utf-8");
console.log("iot.ts rewritten:", content.length, "chars");