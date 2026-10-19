export interface ProjectGuide {
  id: string
  title: string
  level: "beginner" | "intermediate" | "advanced"
  category: "robotics" | "iot" | "basic"
  minutes: number
  objective: string
  components: string[]
  code: string
  explain: string
  expected: string
  troubleshoot: string[]
  challenge: string
  sim?: "robot" | "iot"
}

export const projects: ProjectGuide[] = [
  {
    id: "proj-night-lamp",
    title: "Automatic Night Lamp",
    level: "beginner",
    category: "basic",
    minutes: 20,
    objective: "Turn an LED on automatically when the room gets dark.",
    components: ["Arduino Uno or ESP32", "LDR", "10 kΩ resistor", "LED", "220 Ω resistor", "Breadboard, wires"],
    code: "int ldr = A0;\nint led = 9;\n\nvoid setup() {\n  pinMode(led, OUTPUT);\n}\n\nvoid loop() {\n  int light = analogRead(ldr);\n  if (light < 300) {          // dark room\n    digitalWrite(led, HIGH);\n  } else {\n    digitalWrite(led, LOW);\n  }\n  delay(200);\n}",
    explain:
      "The LDR and the 10 kΩ resistor form a voltage divider on A0. Bright light lowers the LDR resistance and raises the reading; darkness does the opposite. When the reading drops below 300 the room is dark, so the LED turns on.",
    expected: "The LED stays off in daylight and switches on when you cover the LDR.",
    troubleshoot: [
      "LED never turns on: check the 220 Ω series resistor and the LED polarity (long leg to signal).",
      "Always on or always off: swap the divider or move the 300 threshold to match your lighting.",
      "Flickering: add a small delay or average several readings to smooth noise.",
    ],
    challenge: "Fade the LED smoothly with analogWrite instead of switching it hard on and off.",
  },
  {
    id: "proj-obstacle-robot",
    title: "Obstacle-Avoiding Robot",
    level: "intermediate",
    category: "robotics",
    minutes: 40,
    objective: "Build a robot that drives forward and turns away from walls on its own.",
    components: ["2-wheel chassis", "L298N motor driver", "HC-SR04 sensor", "Microcontroller", "Battery pack"],
    code: "void loop() {\n  int d = readDistance();\n  if (d < 20) {\n    stopMotors();\n    turnRight();\n    delay(300);\n  } else {\n    forwardMotors();\n  }\n}",
    explain:
      "The ultrasonic sensor reads the distance ahead. When it falls below 20 cm the robot stops and turns; otherwise it drives forward. This sense-decide-act loop repeats forever.",
    expected: "The robot drives around and turns whenever it gets close to an obstacle.",
    troubleshoot: [
      "Robot spins in one spot: the threshold may be too large, or the sensor is reading a close wall permanently.",
      "Motors don't move: check the L298N power jumpers and that ENA/ENB are receiving PWM.",
      "Erratic readings: mount the sensor away from the motors to reduce vibration and noise.",
    ],
    challenge: "Add a left-turn fallback so the robot does not get stuck bouncing between two walls.",
    sim: "robot",
  },
  {
    id: "proj-line-follower",
    title: "Line-Following Robot",
    level: "intermediate",
    category: "robotics",
    minutes: 45,
    objective: "Steer a robot along a dark line using two IR sensors.",
    components: ["Chassis", "L298N driver", "2× IR line sensors", "Microcontroller", "Battery"],
    code: "void loop() {\n  bool left = readLeft();\n  bool right = readRight();\n  if (!left && !right) forward();       // on the line\n  else if (left && !right) turnRight(); // line drifted left\n  else if (!left && right) turnLeft();\n  else forward();\n}",
    explain:
      "Two sensors straddle the line. Their combined state tells you whether the robot is centered, or veering left or right, and the code corrects the heading accordingly.",
    expected: "The robot follows a black tape line, correcting itself around curves.",
    troubleshoot: [
      "Wanders off: re-calibrate the IR thresholds for your tape and floor contrast.",
      "Oscillates: slow the motors or reduce the correction strength.",
      "No detection: confirm the sensors sit a few millimetres above the surface.",
    ],
    challenge: "Handle intersections by adding a short look-ahead with a third sensor.",
    sim: "robot",
  },
  {
    id: "proj-esp-dashboard",
    title: "ESP32 Sensor Dashboard",
    level: "advanced",
    category: "iot",
    minutes: 50,
    objective: "Serve live sensor readings from an ESP32 to a browser dashboard.",
    components: ["ESP32", "DHT11 sensor", "Wi-Fi network", "Breadboard, wires"],
    code: "void loop() {\n  float t = dht.readTemperature();\n  float h = dht.readHumidity();\n  server.handleClient();   // update any connected browser\n  delay(2000);\n}",
    explain:
      "The ESP32 joins Wi-Fi, reads the DHT11, and answers HTTP requests with the latest values. Any device on the network can open the IP address to watch the readings update.",
    expected: "A web page shows live temperature and humidity refreshing every couple of seconds.",
    troubleshoot: [
      "Cannot connect: double-check SSID and password, and use 2.4 GHz (ESP32 does not support 5 GHz).",
      "Page won't load: find the serial-printed IP address and open it on the same network.",
      "NaN readings: check the sensor wiring and add a pull-up on the data line.",
    ],
    challenge: "Log the readings over time and draw a simple temperature graph on the page.",
    sim: "iot",
  },
]

export function projectById(id: string) {
  return projects.find((p) => p.id === id) ?? null
}
