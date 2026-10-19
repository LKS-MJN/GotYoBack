with open('src/views/Home.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add Reveal import
if 'Reveal' not in c:
    c = c.replace(
        'import { Play, BookOpen, Bot, Wifi, Wrench, CircuitBoard, ArrowRight } from "lucide-react"',
        'import { Play, BookOpen, Bot, Wifi, Wrench, CircuitBoard, ArrowRight } from "lucide-react"\nimport { Reveal, SectionRule } from "@/components/Reveal"'
    )

# Wrap hero in Reveal
c = c.replace(
    '      <section className="space-y-4">',
    '      <Reveal className="space-y-4">'
)
c = c.replace(
    '        <div className="flex flex-wrap gap-3">\n          <Button onClick={() => (resume ? openLesson(resume.id) : go("learn"))}>\n            <Play aria-hidden className="size-4" /> {resume ? "Continue lesson" : "Start learning"}\n          </Button>\n          <Button variant="outline" onClick={() => go("robotics")}>\n            <Bot aria-hidden className="size-4" /> Open Robotics Lab\n          </Button>\n        </div>\n      </section>',
    '        <div className="flex flex-wrap gap-3">\n          <Button onClick={() => (resume ? openLesson(resume.id) : go("learn"))}>\n            <Play aria-hidden className="size-4" /> {resume ? "Continue lesson" : "Start learning"}\n          </Button>\n          <Button variant="outline" onClick={() => go("robotics")}>\n            <Bot aria-hidden className="size-4" /> Open Robotics Lab\n          </Button>\n        </div>\n      </Reveal>'
)

# Add SectionRule after hero
c = c.replace(
    '      {/* Next step */}',
    '      <SectionRule />\n\n      {/* Next step */}'
)

# Wrap quick access in Reveal
c = c.replace(
    '      <section>\n        <h2 className="mb-3 font-display text-lg font-semibold">Quick access</h2>',
    '      <Reveal delay={80}>\n        <h2 className="mb-3 font-display text-lg font-semibold">Quick access</h2>'
)
c = c.replace(
    '        </div>\n      </section>\n\n      {/* Recommended + Progress */}',
    '        </div>\n      </Reveal>\n\n      {/* Recommended + Progress */}'
)

# Wrap the recommended/progress grid in Reveal
c = c.replace(
    '      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">',
    '      <Reveal delay={140} className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">'
)
c = c.replace(
    '        </div>\n      </section>\n\n      {/* Explore */}',
    '        </div>\n      </Reveal>\n\n      {/* Explore */}'
)

# Wrap explore in Reveal
c = c.replace(
    '        <section>\n          <h2 className="mb-3 font-display text-lg font-semibold">Explore other topics</h2>',
    '        <Reveal delay={200}>\n          <h2 className="mb-3 font-display text-lg font-semibold">Explore other topics</h2>'
)
c = c.replace(
    '          </div>\n        </section>\n      </div>\n    </div>\n  )',
    '          </div>\n        </Reveal>\n      </div>\n    </div>\n  )'
)

with open('src/views/Home.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Home.tsx updated with Reveal + SectionRule")
print("Reveal count:", c.count('<Reveal'))
print("SectionRule count:", c.count('SectionRule'))