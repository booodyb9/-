import re

with open('src/pages/public/ProjectDetails.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "const allImages = [",
    "const allImages = [\n    ...(project.image && !project.coverImage ? [project.image] : []),"
)

with open('src/pages/public/ProjectDetails.tsx', 'w') as f:
    f.write(content)
