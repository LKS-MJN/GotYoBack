# GotYoBack

An interactive learning platform for **robotics, electronics, and IoT**. Learn concepts, experiment in virtual labs, and build projects — all without physical hardware.

## Live Demo

**https://gotyoback.vercel.app**

## Features

- **7 Learning Paths**: Electronics Fundamentals, Arduino, ESP32, Sensors & Actuators, Robotics, IoT, Practical Projects
- **Interactive Lessons**: 20+ lessons with code examples, quizzes, and mini-challenges
- **Robotics Lab**: Grid-based robot simulator with ultrasonic sensor, IF-THEN rules, collision detection, and event log
- **IoT Lab**: Smart room simulator with sensor dashboards, automation rules, and device control
- **Projects**: Guided builds with component lists, code, and troubleshooting
- **Components Library**: 18 common electronic parts with specs and pinouts
- **Onboarding**: Personalized learning path based on experience level and interests
- **Progress Tracking**: XP, completed lessons, projects, and missions
- **Local-First**: Works fully offline; optional Supabase cloud sync

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix primitives) |
| Animation | Motion (Framer Motion) |
| Icons | Lucide React |
| Fonts | Archivo, Inter, JetBrains Mono |
| Persistence | localStorage (local-first) + optional Supabase |
| Deploy | Vercel (static SPA) |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/LKS-MJN/GotYoBack.git
cd GotYoBack

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
+-- App.tsx              # App shell, routing, nav
+-- components/          # Reusable UI components
¦   +-- ui/              # shadcn/ui primitives
+-- data/                # Curriculum, hardware, projects
+-- hooks/               # useProgress, useAuth
+-- lib/                 # Utilities, sim engines, preferences
¦   +-- sim/             # Robot and IoT simulation engines
+-- onboarding/          # Onboarding flow
+-- providers/           # AuthProvider
+-- views/               # Page views
knowledge-base/           # Structured curriculum data (JSON)
supabase/                # Database schema
```

## Environment Variables (optional)

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Without these, the app runs fully local with localStorage persistence.

## Design

Brutalist light theme inspired by the portfolio site:
- Warm paper background (#F4EFE6) with ink text (#0b0b0c)
- Blue accent (#012ceb) for primary actions
- Hard borders (2px) and offset shadows
- Archivo display font with variable width
- No visible scrollbars
- Reduced-motion support

## Knowledge Base

The `knowledge-base/` directory contains structured, source-aware curriculum data:
- 7 learning domains with 35 lessons
- 13 quiz questions with explanations
- 5 interactive experiment specifications
- 2 guided projects
- 12 source references with licenses
- AI tutor behavior specification

## License

MIT