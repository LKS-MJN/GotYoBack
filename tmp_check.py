import os

# Read the current file to get the non-icon parts
with open('src/views/Components.tsx', 'r', encoding='utf-8') as f:
    current = f.read()

# The file already has good structure. Let me just verify it builds.
print("File size:", len(current), "chars")
print("Has ComponentIcon:", "function ComponentIcon" in current)
print("Has detail dialog:", "Dialog open={!!selected}" in current)