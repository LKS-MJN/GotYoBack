with open('src/App.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add CountUp import
if 'CountUp' not in c:
    c = c.replace(
        'import { Tour } from "@/components/Tour"',
        'import { Tour } from "@/components/Tour"\nimport { CountUp } from "@/components/CountUp"'
    )

# Wrap XP badge in CountUp
c = c.replace(
    '<span className="rounded-none bg-accent px-2.5 py-1 font-display text-sm font-semibold text-accent-foreground">{api.progress.xp} XP</span>',
    '<span className="rounded-none bg-accent px-2.5 py-1 font-display text-sm font-semibold text-accent-foreground"><CountUp value={api.progress.xp} /> XP</span>'
)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("App.tsx: XP badge now uses CountUp")