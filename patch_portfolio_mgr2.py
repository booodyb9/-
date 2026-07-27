import re

with open('src/pages/dashboard/PortfolioManager.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "const updated = projects.map(p => p.id === currentProject.id ? currentProject as PortfolioProject : p);",
    "const fixedProj = { ...currentProject, slug: currentProject.slug || currentProject.id } as PortfolioProject;\n      const updated = projects.map(p => p.id === currentProject.id ? fixedProj : p);"
)

content = content.replace(
    "const updated = [...projects, currentProject as PortfolioProject];",
    "const fixedProj = { ...currentProject, slug: currentProject.slug || currentProject.id } as PortfolioProject;\n      const updated = [...projects, fixedProj];"
)

with open('src/pages/dashboard/PortfolioManager.tsx', 'w') as f:
    f.write(content)
