with open('src/views/IoTLab.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update imports: add setSensorValue
c = c.replace(
    'import { createIoT, tickIoT, resetIoT, type IoTSim } from "@/lib/sim/iot"',
    'import { createIoT, tickIoT, resetIoT, setSensorValue, type IoTSim } from "@/lib/sim/iot"'
)

# 2. Replace manualSet with setSensorValue
c = c.replace(
    '''  function manualSet(sensorId: string, value: number) {
    setSim((s) => ({
      ...s,
      sensors: s.sensors.map((x) => (x.id === sensorId ? { ...x, value } : x)),
    }))
  }''',
    '''  function manualSet(sensorId: string, value: number) {
    setSim((s) => setSensorValue(s, sensorId, value))
  }'''
)

# 3. Fix interval duplication: depend only on running
c = c.replace(
    '''  useEffect(() => {
    if (!running) return
    const t = setTimeout(() => setSim((s) => tickIoT(s)), 700)
    return () => clearTimeout(t)
  }, [running, sim])''',
    '''  useEffect(() => {
    if (!running) return
    const t = setInterval(() => setSim((s) => tickIoT(s)), 700)
    return () => clearInterval(t)
  }, [running])'''
)

# 4. Add live-dot to the header status area
c = c.replace(
    '''        <div className="flex items-center gap-2">
          <div className="flex rounded-none border-2 border-border bg-card p-0.5">''',
    '''        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="live-dot" aria-hidden />
            {running ? "Live" : "Paused"}
          </span>
          <div className="flex items-center gap-2">
          <div className="flex rounded-none border-2 border-border bg-card p-0.5">'''
)

# Close the extra div after the buttons
c = c.replace(
    '''          <Button variant="outline" onClick={() => { setSim(resetIoT()); counted.current = false }} aria-label="Reset">
            <RotateCcw aria-hidden /> Reset
          </Button>
        </div>
      </header>''',
    '''          <Button variant="outline" onClick={() => { setSim(resetIoT()); counted.current = false }} aria-label="Reset">
            <RotateCcw aria-hidden /> Reset
          </Button>
          </div>
        </div>
      </header>'''
)

with open('src/views/IoTLab.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("IoTLab.tsx updated")
print("setSensorValue:", "setSensorValue" in c)
print("interval fix:", "setInterval" in c and "[running])" in c)
print("live-dot:", "live-dot" in c)