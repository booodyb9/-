import re

with open('src/pages/dashboard/ContentManager.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "value={editingContent.body || (section.type === 'array' ? '[]' : '')}",
    "value={editingContent.body || ''}"
)

with open('src/pages/dashboard/ContentManager.tsx', 'w') as f:
    f.write(content)
