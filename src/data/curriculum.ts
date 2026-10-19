// Structured curriculum: learning paths + lessons.
// Lessons use a small block model so the template stays consistent and new
// topics can be added without touching the renderer.

export type Block =
  | { type: "prose"; heading: string; body: string }
  | { type: "list"; heading: string; items: string[] }
  | { type: "code"; language: string; code: string; explain?: string }
  | { type: "sim"; sim: "robot" | "iot" | "ultrasonic" | "ledcircuit"; note: string }
  | { type: "quiz"; question: string; options: string[]; correct: number; explain: string }
  | { type: "challenge"; prompt: string }

export interface Lesson {
  id: string
  pathId: string
  title: string
  difficulty: "beginner" | "intermediate" | "advanced"
  minutes: number
  summary: string
  blocks: Block[]
  xp: number
}

export interface Path {
  id: string
  index: number
  title: string
  blurb: string
  level: "beginner" | "intermediate" | "advanced"
  lessonIds: string[]
}

export const paths: Path[] = [
  {
    id: "electronics",
    index: 1,
    title: "Electronics Fundamentals",
    blurb: "Voltage, current, resistance, and the components every circuit is built from.",
    level: "beginner",
    lessonIds: ["elec-ohm", "elec-series-parallel", "elec-led"],
  },
  {
    id: "arduino",
    index: 2,
    title: "Arduino & Microcontrollers",
    blurb: "What a microcontroller is and how to read inputs and drive outputs.",
    level: "beginner",
    lessonIds: ["ard-intro", "ard-digital", "ard-analog"],
  },
  {
    id: "esp32",
    index: 3,
    title: "ESP32 & ESP8266",
    blurb: "Board architecture, GPIO, Wi-Fi, and serving data from a browser.",
    level: "intermediate",
    lessonIds: ["esp-intro", "esp-wifi"],
  },
  {
    id: "sensors",
    index: 4,
    title: "Sensors & Actuators",
    blurb: "Ultrasonic, IR, temperature, and light sensors plus the motors they drive.",
    level: "intermediate",
    lessonIds: ["sen-ultrasonic", "sen-temp", "sen-ir"],
  },
  {
    id: "robotics",
    index: 5,
    title: "Robotics & Robot Control",
    blurb: "Drive systems, differential steering, and autonomous obstacle avoidance.",
    level: "intermediate",
    lessonIds: ["rob-drive", "rob-differential", "rob-obstacle"],
  },
  {
    id: "iot",
    index: 6,
    title: "IoT & Smart Automation",
    blurb: "Connect devices, move data with MQTT, and monitor the real world remotely.",
    level: "advanced",
    lessonIds: ["iot-intro", "iot-mqtt"],
  },
  {
    id: "projects",
    index: 7,
    title: "Practical Projects",
    blurb: "End-to-end builds that combine everything into a working device.",
    level: "advanced",
    lessonIds: ["proj-night-lamp", "proj-obstacle-robot"],
  },
]

const L = (l: Lesson) => l

export const lessons: Record<string, Lesson> = Object.fromEntries(
  [
    // ---- Electronics Fundamentals ----
    L({
      id: "elec-ohm",
      pathId: "electronics",
      title: "Ohm's Law: Voltage, Current, Resistance",
      difficulty: "beginner",
      minutes: 8,
      summary: "The one equation that relates voltage, current, and resistance in every circuit.",
      xp: 20,
      blocks: [
        {
          type: "prose",
          heading: "The problem it solves",
          body: "When you wire up a component you often need to know how much current will flow, or what resistor to pick. Ohm's Law is the relationship that lets you predict this before you build anything.",
        },
        {
          type: "prose",
          heading: "How it works",
          body: "Voltage (V) is the push that moves charge. Current (I) is how much charge flows per second. Resistance (R) opposes that flow. Ohm's Law states V = I × R. Rearranged: I = V / R and R = V / I.",
        },
        {
          type: "list",
          heading: "The three quantities and their units",
          items: [
            "Voltage V, measured in volts (V).",
            "Current I, measured in amperes (A), often milliamps (mA).",
            "Resistance R, measured in ohms (Ω).",
          ],
        },
        {
          type: "prose",
          heading: "Worked example",
          body: "A 5 V supply drives current through a 220 Ω resistor. I = 5 / 220 ≈ 0.0227 A, or about 22.7 mA. That is a safe, typical current for a small indicator LED.",
        },
        {
          type: "quiz",
          question: "A 9 V battery is applied across a 330 Ω resistor. Approximately how much current flows?",
          options: ["27 mA", "3.3 A", "297 mA"],
          correct: 0,
          explain: "I = V / R = 9 / 330 ≈ 0.027 A = 27 mA.",
        },
        {
          type: "challenge",
          prompt: "Using Ohm's Law, work out the resistor needed to limit an LED to 20 mA from a 5 V supply (assume a 2 V LED drop). Hint: the resistor sees 3 V.",
        },
      ],
    }),
    L({
      id: "elec-series-parallel",
      pathId: "electronics",
      title: "Series vs Parallel Circuits",
      difficulty: "beginner",
      minutes: 7,
      summary: "How components share voltage in series and current in parallel.",
      xp: 20,
      blocks: [
        {
          type: "prose",
          heading: "Two ways to connect components",
          body: "Components can be chained end to end (series) or bridged across the same two points (parallel). Each arrangement changes how voltage and current are shared.",
        },
        {
          type: "prose",
          heading: "Series circuits",
          body: "In a series chain there is only one path, so the same current flows through every component. Voltages add up across the chain. Remove one part and the whole path breaks.",
        },
        {
          type: "prose",
          heading: "Parallel circuits",
          body: "In parallel each branch sees the same voltage, and the total current is the sum of the branch currents. Each branch works independently, so one can fail without stopping the others.",
        },
        {
          type: "list",
          heading: "Quick rules of thumb",
          items: [
            "Series: current is shared, voltage divides.",
            "Parallel: voltage is shared, current divides.",
            "Batteries in series add voltage; in parallel they add capacity.",
          ],
        },
        {
          type: "quiz",
          question: "Two identical resistors are in parallel across 10 V. What voltage does each see?",
          options: ["10 V", "5 V", "20 V"],
          correct: 0,
          explain: "Every branch in parallel sees the full source voltage, so each resistor sees 10 V.",
        },
      ],
    }),
    L({
      id: "elec-led",
      pathId: "electronics",
      title: "LEDs and Current-Limiting Resistors",
      difficulty: "beginner",
      minutes: 6,
      summary: "Why an LED needs a resistor and how to size it.",
      xp: 20,
      blocks: [
        {
          type: "prose",
          heading: "LEDs are current devices",
          body: "An LED lights when forward biased, but it has almost no internal resistance once it conducts. Without a limit it will draw too much current and burn out. A series resistor sets a safe current.",
        },
        {
          type: "code",
          language: "text",
          code: "R = (Vsupply - Vled) / Iled\n\n// 5V supply, red LED (2V), target 20mA:\n// R = (5 - 2) / 0.02 = 150 ohms",
          explain: "Subtract the LED's forward voltage from the supply, then divide by your target current.",
        },
        {
          type: "sim",
          sim: "ledcircuit",
          note: "Open the LED circuit experiment: change the supply voltage and resistor and watch the computed current.",
        },
        {
          type: "quiz",
          question: "Why is a resistor placed in series with an LED?",
          options: [
            "To limit the current to a safe value",
            "To increase the LED brightness",
            "To change the LED color",
          ],
          correct: 0,
          explain: "The resistor drops the extra voltage and caps the current so the LED is not destroyed.",
        },
      ],
    }),

    // ---- Arduino ----
    L({
      id: "ard-intro",
      pathId: "arduino",
      title: "What Is a Microcontroller?",
      difficulty: "beginner",
      minutes: 7,
      summary: "A computer on a single chip that reads inputs and drives outputs.",
      xp: 20,
      blocks: [
        {
          type: "prose",
          heading: "The idea",
          body: "A microcontroller packs a processor, memory, and input/output pins onto one chip. It runs one program in a loop, reading sensors and switching actuators with no operating system needed.",
        },
        {
          type: "list",
          heading: "What lives on an Arduino board",
          items: [
            "The microcontroller chip (for example the ATmega328P on an Uno).",
            "Digital pins for on/off input and output.",
            "Analog input pins with an analog-to-digital converter.",
            "A voltage regulator and USB interface for power and programming.",
          ],
        },
        {
          type: "prose",
          heading: "The sketch loop",
          body: "An Arduino program has setup(), which runs once, and loop(), which runs forever. Everything you write lives in that repeating loop.",
        },
        {
          type: "quiz",
          question: "How many times does loop() run on an Arduino?",
          options: ["Once", "Forever, repeatedly", "Only when a button is pressed"],
          correct: 1,
          explain: "loop() runs over and over for as long as the board has power.",
        },
      ],
    }),
    L({
      id: "ard-digital",
      pathId: "arduino",
      title: "Digital Input and Output",
      difficulty: "beginner",
      minutes: 9,
      summary: "Blink an LED and read a button with pinMode and digitalRead.",
      xp: 25,
      blocks: [
        {
          type: "prose",
          heading: "Digital pins are either HIGH or LOW",
          body: "A digital output pin can be set HIGH (usually 5 V) or LOW (0 V). A digital input pin reads a switch or sensor as HIGH or LOW. This is the simplest form of input and output.",
        },
        {
          type: "code",
          language: "cpp",
          code: "const int led = 13;\nconst int button = 2;\n\nvoid setup() {\n  pinMode(led, OUTPUT);\n  pinMode(button, INPUT_PULLUP);\n}\n\nvoid loop() {\n  if (digitalRead(button) == LOW) {\n    digitalWrite(led, HIGH);   // button pressed\n  } else {\n    digitalWrite(led, LOW);\n  }\n}",
          explain: "INPUT_PULLUP uses the pin's internal resistor, so a pressed button reads LOW. The LED mirrors the button state.",
        },
        {
          type: "sim",
          sim: "ledcircuit",
          note: "Visualize a digital output driving an LED and a button feeding a digital input.",
        },
        {
          type: "quiz",
          question: "With INPUT_PULLUP, what does a pressed button (to ground) usually read?",
          options: ["HIGH", "LOW", "Analog value"],
          correct: 1,
          explain: "The pull-up holds the pin HIGH; pressing to ground pulls it LOW.",
        },
      ],
    }),
    L({
      id: "ard-analog",
      pathId: "arduino",
      title: "Analog Input and PWM Output",
      difficulty: "beginner",
      minutes: 8,
      summary: "Read a varying sensor value and dim an LED with PWM.",
      xp: 25,
      blocks: [
        {
          type: "prose",
          heading: "Analog inputs measure a range",
          body: "An analogRead() pin samples a voltage between 0 V and the reference (5 V) and maps it to 0 to 1023 with a 10-bit converter. A potentiometer or light sensor gives a smoothly changing number.",
        },
        {
          type: "prose",
          heading: "PWM mimics analog output",
          body: "A digital pin can only be fully on or off, but switching rapidly and varying the duty cycle averages out to an intermediate brightness. analogWrite(0 to 255) sets that duty cycle.",
        },
        {
          type: "code",
          language: "cpp",
          code: "int sensor = A0;\nint led = 9;\n\nvoid setup() {\n  pinMode(led, OUTPUT);\n}\n\nvoid loop() {\n  int value = analogRead(sensor);        // 0..1023\n  int brightness = value / 4;            // 0..255\n  analogWrite(led, brightness);\n}",
          explain: "The analog sensor reading is rescaled to the 0-255 PWM range so brighter readings dim the LED up.",
        },
        {
          type: "quiz",
          question: "What does analogRead() return on a classic 10-bit Arduino pin?",
          options: ["0 to 255", "0 to 1023", "0 to 1"],
          correct: 1,
          explain: "A 10-bit converter gives 1024 steps, so the result ranges from 0 to 1023.",
        },
      ],
    }),

    // ---- ESP32 ----
    L({
      id: "esp-intro",
      pathId: "esp32",
      title: "ESP32 Architecture and GPIO",
      difficulty: "intermediate",
      minutes: 9,
      summary: "A dual-core microcontroller with built-in Wi-Fi and Bluetooth.",
      xp: 25,
      blocks: [
        {
          type: "prose",
          heading: "More than a microcontroller",
          body: "The ESP32 is a dual-core chip with integrated Wi-Fi and Bluetooth, plenty of GPIO, ADC, DAC, and PWM. It can host a web server or talk to the cloud without extra hardware.",
        },
        {
          type: "list",
          heading: "Good to know before wiring",
          items: [
            "Most GPIO pins are safe for digital input and output.",
            "Only specific pins (marked ADC) accept analog input, and the range is 0 to 3.3 V.",
            "The board runs at 3.3 V logic, so 5 V signals can damage it.",
          ],
        },
        {
          type: "code",
          language: "cpp",
          code: "const int led = 2;   // many boards have a blue LED on GPIO2\n\nvoid setup() {\n  pinMode(led, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(led, HIGH);\n  delay(500);\n  digitalWrite(led, LOW);\n  delay(500);\n}",
          explain: "Same blink as Arduino, but pin numbering and 3.3 V logic follow the ESP32 pinout.",
        },
        {
          type: "quiz",
          question: "What logic voltage does the ESP32 use?",
          options: ["5 V", "3.3 V", "12 V"],
          correct: 1,
          explain: "The ESP32 is a 3.3 V device; feeding 5 V into a GPIO can damage it.",
        },
      ],
    }),
    L({
      id: "esp-wifi",
      pathId: "esp32",
      title: "Connect ESP32 to Wi-Fi and Serve a Page",
      difficulty: "intermediate",
      minutes: 12,
      summary: "Join a network and show a live sensor reading in a browser.",
      xp: 30,
      blocks: [
        {
          type: "prose",
          heading: "The ESP32 as a tiny web server",
          body: "Once connected to Wi-Fi, the ESP32 can accept HTTP requests and respond with a web page. This turns a phone or laptop browser into a remote display for your sensors.",
        },
        {
          type: "code",
          language: "cpp",
          code: "#include <WiFi.h>\n\nconst char* ssid = \"YOUR_WIFI\";\nconst char* pass = \"YOUR_PASS\";\nWiFiServer server(80);\n\nvoid setup() {\n  WiFi.begin(ssid, pass);\n  while (WiFi.status() != WL_CONNECTED) { delay(250); }\n  server.begin();\n}\n\nvoid loop() {\n  WiFiClient c = server.available();\n  if (c) {\n    int reading = analogRead(34);   // sensor on ADC pin 34\n    c.println(\"HTTP/1.1 200 OK\\r\\nContent-Type: text/html\\r\\n\\r\\n\");\n    c.println(\"<h1>Sensor: \" + String(reading) + \"</h1>\");\n    c.stop();\n  }\n}",
          explain: "The board joins Wi-Fi in setup(), then serves the latest analog reading to any browser that connects.",
        },
        {
          type: "sim",
          sim: "iot",
          note: "See the sensor-to-dashboard data flow that this kind of web server enables.",
        },
        {
          type: "quiz",
          question: "What does the ESP32 act as once it is serving web pages?",
          options: ["A client", "A web server", "A Bluetooth speaker"],
          correct: 1,
          explain: "It listens on a port and responds to requests, which is a web server.",
        },
      ],
    }),

    // ---- Sensors ----
    L({
      id: "sen-ultrasonic",
      pathId: "sensors",
      title: "Ultrasonic Distance Sensor (HC-SR04)",
      difficulty: "intermediate",
      minutes: 10,
      summary: "Measure distance with a sound pulse and time its echo.",
      xp: 30,
      blocks: [
        {
          type: "prose",
          heading: "How it works",
          body: "The sensor emits a short ultrasonic chirp and listens for the echo. Sound travels at about 343 m/s, so measuring the round-trip time gives the distance to the nearest object: distance = (time × speed) / 2, divided by two because the sound travels there and back.",
        },
        {
          type: "code",
          language: "cpp",
          code: "long readDistance() {\n  digitalWrite(trigPin, LOW);\n  delayMicroseconds(2);\n  digitalWrite(trigPin, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(trigPin, LOW);\n  long us = pulseIn(echoPin, HIGH);\n  return us / 58;   // centimetres\n}",
          explain: "A 10 µs trigger pulse starts the chirp; pulseIn() measures the echo duration and 58 converts microseconds to centimetres.",
        },
        {
          type: "sim",
          sim: "ultrasonic",
          note: "Move the object and watch the measured distance update, exactly as the Robotics Lab does.",
        },
        {
          type: "quiz",
          question: "Why do we divide the echo time by two when computing distance?",
          options: [
            "Because the sound travels to the object and back",
            "To convert microseconds to seconds",
            "Because sound loses half its energy",
          ],
          correct: 0,
          explain: "The measured time covers the trip out and the return, so the one-way distance is half.",
        },
      ],
    }),
    L({
      id: "sen-temp",
      pathId: "sensors",
      title: "Temperature and Humidity (DHT11)",
      difficulty: "intermediate",
      minutes: 7,
      summary: "Read environmental conditions with a digital sensor.",
      xp: 25,
      blocks: [
        {
          type: "prose",
          heading: "One wire, two readings",
          body: "The DHT11 returns temperature and humidity over a single digital pin using a custom one-wire protocol. A library handles the timing so you can just request a reading.",
        },
        {
          type: "code",
          language: "cpp",
          code: "#include <DHT.h>\nDHT dht(4, DHT11);\n\nvoid setup() { dht.begin(); }\n\nvoid loop() {\n  float t = dht.readTemperature();\n  float h = dht.readHumidity();\n  delay(1000);\n}",
          explain: "Attach the data pin to a GPIO (here 4), then read temperature in Celsius and humidity in percent.",
        },
        {
          type: "sim",
          sim: "iot",
          note: "Drive a fan from a temperature threshold in the IoT Lab, the same way this sensor would.",
        },
        {
          type: "quiz",
          question: "What does the DHT11 measure?",
          options: ["Distance and light", "Temperature and humidity", "Sound and vibration"],
          correct: 1,
          explain: "The DHT11 is a combined temperature and humidity sensor.",
        },
      ],
    }),
    L({
      id: "sen-ir",
      pathId: "sensors",
      title: "IR Obstacle and Line Sensors",
      difficulty: "intermediate",
      minutes: 6,
      summary: "Detect objects and follow lines with infrared reflection.",
      xp: 25,
      blocks: [
        {
          type: "prose",
          heading: "Detect by reflection",
          body: "An IR sensor shines infrared light and checks for reflected return. A nearby object reflects enough light to trigger the output. A line sensor uses the same idea, noticing the contrast between a dark line and a light floor.",
        },
        {
          type: "list",
          heading: "Typical outputs",
          items: [
            "Digital version: LOW when an object is detected (active-low is common).",
            "Analog version: a changing voltage you compare against a threshold.",
            "A small potentiometer on the board adjusts sensitivity.",
          ],
        },
        {
          type: "quiz",
          question: "How does an IR obstacle sensor detect an object?",
          options: [
            "By measuring its temperature",
            "By infrared light reflecting back to the receiver",
            "By sending a radio ping",
          ],
          correct: 1,
          explain: "The emitter sends IR light; a close object reflects it back to the detector and trips the output.",
        },
      ],
    }),

    // ---- Robotics ----
    L({
      id: "rob-drive",
      pathId: "robotics",
      title: "Robot Chassis and Drive Systems",
      difficulty: "intermediate",
      minutes: 8,
      summary: "How wheels, motors, and motor drivers move a robot.",
      xp: 25,
      blocks: [
        {
          type: "prose",
          heading: "From code to motion",
          body: "A microcontroller pin cannot supply enough current to drive a motor directly. A motor driver (such as the L298N) sits between them, switching high current from the battery using low-power control signals.",
        },
        {
          type: "list",
          heading: "Common drive layouts",
          items: [
            "Two-wheel differential drive with a caster: simple and popular.",
            "Four-wheel drive for more traction.",
            "Omni-wheel bases that can strafe sideways.",
          ],
        },
        {
          type: "quiz",
          question: "Why is a motor driver needed between the microcontroller and a DC motor?",
          options: [
            "To convert the motor to servo",
            "Because the pins cannot supply enough current",
            "To slow the motor down",
          ],
          correct: 1,
          explain: "GPIO pins output only a few milliamps; the driver switches the motor's much larger current.",
        },
      ],
    }),
    L({
      id: "rob-differential",
      pathId: "robotics",
      title: "Differential Drive and Turning",
      difficulty: "intermediate",
      minutes: 9,
      summary: "Steer by varying the speed of the left and right wheels.",
      xp: 25,
      blocks: [
        {
          type: "prose",
          heading: "Turning without a steering wheel",
          body: "A two-wheel robot turns by running its wheels at different speeds. Equal speeds go straight; one wheel faster turns toward the slower side; equal speeds in opposite directions spin in place.",
        },
        {
          type: "list",
          heading: "Movement recipes",
          items: [
            "Forward: both wheels same direction and speed.",
            "Turn right: left wheel faster than right.",
            "Spin in place: wheels in opposite directions at equal speed.",
          ],
        },
        {
          type: "sim",
          sim: "robot",
          note: "Drive the simulated robot and watch how wheel commands change its heading.",
        },
        {
          type: "quiz",
          question: "How does a two-wheel robot turn in place?",
          options: [
            "Both wheels forward at different speeds",
            "Wheels rotate in opposite directions at equal speed",
            "It lifts one wheel off the ground",
          ],
          correct: 1,
          explain: "Opposite directions with equal speed cancel forward motion and produce a pure rotation.",
        },
      ],
    }),
    L({
      id: "rob-obstacle",
      pathId: "robotics",
      title: "Obstacle-Avoidance Logic",
      difficulty: "intermediate",
      minutes: 11,
      summary: "Combine an ultrasonic sensor with a rule to steer around walls.",
      xp: 30,
      blocks: [
        {
          type: "prose",
          heading: "Sense, decide, act",
          body: "Autonomous avoidance repeats a simple cycle: read the distance ahead, compare it to a threshold, and act. If something is close, stop and turn. Otherwise keep moving forward.",
        },
        {
          type: "code",
          language: "cpp",
          code: "int d = readDistance();\n\nif (d < 20) {         // obstacle ahead\n  stop();\n  turnRight();\n} else {\n  forward();\n}",
          explain: "This is exactly the IF-THEN rule the Robotics Lab simulator runs. The distance reading drives the decision.",
        },
        {
          type: "sim",
          sim: "robot",
          note: "Open the Robotics Lab and build this rule in the maze simulator.",
        },
        {
          type: "quiz",
          question: "What should a robot do when the ultrasonic reading drops below its threshold?",
          options: ["Speed up", "Stop and turn to avoid the obstacle", "Ignore it"],
          correct: 1,
          explain: "A close obstacle means stop and change direction to avoid a collision.",
        },
      ],
    }),

    // ---- IoT ----
    L({
      id: "iot-intro",
      pathId: "iot",
      title: "What Is the Internet of Things?",
      difficulty: "beginner",
      minutes: 7,
      summary: "Devices that sense the world and report it over a network.",
      xp: 20,
      blocks: [
        {
          type: "prose",
          heading: "Computing in the real world",
          body: "IoT connects everyday devices to a network so their data can be monitored, logged, and acted on remotely. A sensor node measures something, a controller decides, and an actuator or dashboard acts on the result.",
        },
        {
          type: "list",
          heading: "The building blocks",
          items: [
            "Sensors measure the environment.",
            "Controllers (like an ESP32) run the logic.",
            "Actuators do physical work: lights, fans, relays.",
            "Gateways and the cloud move and store the data.",
          ],
        },
        {
          type: "sim",
          sim: "iot",
          note: "See the full sensor to dashboard loop in the IoT Lab.",
        },
        {
          type: "quiz",
          question: "Which component decides what to do with a sensor reading?",
          options: ["The actuator", "The controller", "The power supply"],
          correct: 1,
          explain: "The controller runs the logic that turns readings into decisions.",
        },
      ],
    }),
    L({
      id: "iot-mqtt",
      pathId: "iot",
      title: "MQTT and Device Communication",
      difficulty: "advanced",
      minutes: 11,
      summary: "A lightweight messaging protocol built for devices.",
      xp: 30,
      blocks: [
        {
          type: "prose",
          heading: "Publish and subscribe",
          body: "MQTT is a tiny messaging protocol made for slow, unreliable networks. Devices publish messages to named topics, and subscribers listen to those topics. A broker in the middle routes everything.",
        },
        {
          type: "list",
          heading: "Why MQTT suits IoT",
          items: [
            "Very small packet overhead.",
            "Decouples senders from receivers by topic.",
            "Supports quality-of-service levels and retained messages.",
          ],
        },
        {
          type: "quiz",
          question: "What routes MQTT messages between publishers and subscribers?",
          options: ["The broker", "The sensor", "The motor driver"],
          correct: 0,
          explain: "A broker sits in the middle and forwards messages matching each topic.",
        },
      ],
    }),

    // ---- Projects ----
    L({
      id: "proj-night-lamp",
      pathId: "projects",
      title: "Automatic Night Lamp",
      difficulty: "beginner",
      minutes: 15,
      summary: "Turn an LED on automatically when it gets dark.",
      xp: 40,
      blocks: [
        {
          type: "prose",
          heading: "Objective",
          body: "Build a lamp that stays off in daylight and lights up at night using a light-dependent resistor (LDR) as the sensor.",
        },
        {
          type: "list",
          heading: "Components",
          items: ["Arduino or ESP32", "LDR", "10 kΩ resistor", "LED", "220 Ω resistor", "Breadboard and wires"],
        },
        {
          type: "code",
          language: "cpp",
          code: "int ldr = A0;\nint led = 9;\n\nvoid loop() {\n  int light = analogRead(ldr);\n  if (light < 300) {          // dark room\n    digitalWrite(led, HIGH);\n  } else {\n    digitalWrite(led, LOW);\n  }\n  delay(200);\n}",
          explain: "A low LDR reading means darkness, which switches the LED on. Adjust the 300 threshold for your room.",
        },
        {
          type: "challenge",
          prompt: "Extend the night lamp with a smooth transition: use PWM to fade the LED gradually instead of switching it hard on and off.",
        },
      ],
    }),
    L({
      id: "proj-obstacle-robot",
      pathId: "projects",
      title: "Obstacle-Avoiding Robot",
      difficulty: "intermediate",
      minutes: 25,
      summary: "A mobile robot that steers itself around walls.",
      xp: 60,
      blocks: [
        {
          type: "prose",
          heading: "Objective",
          body: "Combine a differential-drive chassis, a motor driver, and an ultrasonic sensor into a robot that drives forward and turns away from obstacles on its own.",
        },
        {
          type: "list",
          heading: "Components",
          items: ["Chassis with two DC motors", "L298N motor driver", "HC-SR04 ultrasonic sensor", "Microcontroller", "Battery pack"],
        },
        {
          type: "code",
          language: "cpp",
          code: "void loop() {\n  int d = readDistance();\n  if (d < 20) {\n    stopMotors();\n    turnRight();\n    delay(300);\n  } else {\n    forwardMotors();\n  }\n}",
          explain: "This is the sense-decide-act loop running continuously. It matches the Robotics Lab mission.",
        },
        {
          type: "sim",
          sim: "robot",
          note: "Test the exact avoidance behavior in the Robotics Lab before wiring real motors.",
        },
        {
          type: "challenge",
          prompt: "Change the threshold from 20 cm to 10 cm and predict what happens before you run it. Then try adding a left-turn fallback so the robot does not get stuck in a corner.",
        },
      ],
    }),
  ].map((l) => [l.id, l]),
)

export function lessonsForPath(pathId: string): Lesson[] {
  const p = paths.find((x) => x.id === pathId)
  if (!p) return []
  return p.lessonIds.map((id) => lessons[id]).filter(Boolean)
}

export const allLessons: Lesson[] = Object.values(lessons)
