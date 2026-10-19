with open('src/views/Components.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_marker = '  const common = "size-6 text-primary"\n  switch (category) {'
idx = content.find(old_marker)
print('found at:', idx)