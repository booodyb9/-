import re

with open('src/pages/dashboard/PortfolioManager.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import { saveContent } from '../../lib/supabase';",
    "import { saveContent } from '../../lib/supabase';\nimport { useContent } from '../../contexts/ContentContext';"
)

content = content.replace(
    "export default function PortfolioManager({ contents, fetchContents, token }: Props) {",
    "export default function PortfolioManager({ contents, fetchContents, token }: Props) {\n  const { updateContent } = useContent();"
)

content = content.replace(
    "await saveContent('premium_portfolio_projects', 'Premium Portfolio Projects', 'json', JSON.stringify(newProjects));",
    "await saveContent('premium_portfolio_projects', 'Premium Portfolio Projects', 'json', JSON.stringify(newProjects));\n      updateContent('premium_portfolio_projects', JSON.stringify(newProjects));"
)

# Auto-generate slug if missing
content = content.replace(
    "setCurrentProject({ ...project });",
    "if (!project.slug) project.slug = project.id;\n    setCurrentProject({ ...project });"
)

with open('src/pages/dashboard/PortfolioManager.tsx', 'w') as f:
    f.write(content)
