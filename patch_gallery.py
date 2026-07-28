import re

with open('src/components/Gallery.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'const defaultProjects: PortfolioProject[] = [',
    'const defaultProjects: PortfolioProject[] = (['
)

# find the end of the array and add ' as PortfolioProject[])'
content = content.replace(
    '  }\n];',
    '  }\n] as unknown as PortfolioProject[]);'
)

with open('src/components/Gallery.tsx', 'w') as f:
    f.write(content)
