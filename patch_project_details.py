import re

with open('src/pages/public/ProjectDetails.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "const found = projects.find(p => p.slug === slug);",
    "const found = projects.find(p => p.slug === slug || p.id === slug);"
)

with open('src/pages/public/ProjectDetails.tsx', 'w') as f:
    f.write(content)
