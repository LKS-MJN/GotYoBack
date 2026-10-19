// IoT smart-environment simulation engine.
// Pure state machine driven by automation rules. Sensor values move on their
// own each tick (simulating the environment) and the user can also nudge them.
// Devices turn on/off only when a rule genuinely fires.

export interface Sensor {
  id: string
  name: string
  unit: string
  value: number
  min: number
  max: number
  drift: number // typical change per tick
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
  /** Rolling history for the dashboard: sensorId -> recent values. */
  series: Record<string, number[]>
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export function createIoT(): IoTSim {
  return {
    tick: 0,
    running: false,
    sensors: [
      { id: "temp", name: "Temperature", unit: "°C", value: 24, min: 10, max: 45, drift: 0.6 },
      { id: "bright", name: "Brightness", unit: "lux", value: 320, min: 0, max: 900, drift: 40 },
      { id: "motion", name: "Motion", unit: "detected", value: 0, min: 0, max: 1, drift: 0.3 },
      { id: "water", name: "Water level", unit: "%", value: 35, min: 0, max: 100, drift: 3 },
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
  }
}

/** Nudge the environment one tick: drift sensors, then evaluate every rule. */
export function tickIoT(sim: IoTSim): IoTSim {
  const sensors = sim.sensors.map((s) => {
    // Semi-random but bounded environment movement.
    const jitter = (Math.random() - 0.5) * 2 * s.drift
    const value = clamp(s.value + jitter, s.min, s.max)
    // Motion flickers more abruptly.
    const v = s.id === "motion" ? (Math.random() > 0.7 ? 1 : 0) : Math.round(value * 10) / 10
    return { ...s, value: v }
  })

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
      log.push({
        tick: sim.tick + 1,
        ruleId: r.id,
        deviceId: r.deviceId,
        fired: true,
        note: `${sensor?.name} ${r.op} ${r.threshold}: ${dev.name} turned ${target ? "ON" : "OFF"}.`,
      })
    }
  }

  const series: Record<string, number[]> = { ...sim.series }
  for (const s of sensors) {
    const arr = [...(series[s.id] ?? []), s.value]
    series[s.id] = arr.slice(-40) // keep last 40 points
  }

  return {
    ...sim,
    tick: sim.tick + 1,
    sensors,
    devices: devices.map((d) => deviceById.get(d.id)!),
    log: [...sim.log, ...log].slice(-60),
    series,
  }
}

export function resetIoT(): IoTSim {
  const fresh = createIoT()
  return fresh
}
