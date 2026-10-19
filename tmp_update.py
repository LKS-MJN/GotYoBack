# Python script to update Components.tsx with detailed per-component SVGs
# We'll modify the ComponentIcon function to accept id and provide detailed SVGs

import re

# Read current file
with open('src/views/Components.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the ComponentIcon function signature to accept id
old_sig = 'function ComponentIcon({ category }: { category: ComponentEntry["category"] }) {'
new_sig = 'function ComponentIcon({ id, category }: { id: string; category: ComponentEntry["category"] }) {'
content = content.replace(old_sig, new_sig)

# Update the two call sites
content = content.replace('<ComponentIcon category={c.category} />', '<ComponentIcon id={c.id} category={c.category} />')
content = content.replace('<ComponentIcon category={selected.category} />', '<ComponentIcon id={selected.id} category={selected.category} />')

with open('src/views/Components.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated ComponentIcon signature and call sites")
print("ComponentIcon calls:", content.count('ComponentIcon id='))