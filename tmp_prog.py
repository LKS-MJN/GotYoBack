with open('src/views/Progress.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add CountUp import
if 'CountUp' not in c:
    c = c.replace(
        'import { motion } from "motion/react"',
        'import { motion } from "motion/react"\nimport { CountUp } from "@/components/CountUp"'
    )

# Wrap percentage in CountUp
c = c.replace(
    '<span className="font-display text-2xl font-bold text-primary">{percent}%</span>',
    '<span className="font-display text-2xl font-bold text-primary"><CountUp value={percent} />%</span>'
)

# Wrap XP value in CountUp (the stats section)
c = c.replace(
    '<dd className="mt-1 font-display text-lg font-semibold">{s.value}</dd>',
    '<dd className="mt-1 font-display text-lg font-semibold">{s.value}</dd>'
)

with open('src/views/Progress.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Progress.tsx: percentage now uses CountUp")