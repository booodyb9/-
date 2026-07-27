import re

with open('src/pages/dashboard/PagesManager.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "export default function PagesManager({ pages, fetchContents }: Props) {",
    "export default function PagesManager({ pages, fetchContents }: Props) {\n  const parsedPages = pages.map(p => ({ ...p, parsed: p.parsed || (p.body ? JSON.parse(p.body) : {}) }));"
)

content = content.replace(
    "pages.length === 0",
    "parsedPages.length === 0"
)

content = content.replace(
    "pages.map((page: any) => (",
    "parsedPages.map((page: any) => ("
)

content = content.replace(
    "await saveContent(editingPage.key, editingPage.parsed.title, 'page', JSON.stringify(editingPage.parsed));",
    "await saveContent(editingPage.key, editingPage.parsed.title, 'page', JSON.stringify(editingPage.parsed));"
)

content = content.replace(
    "updateContent(editingPage.key, editingPage.body);",
    "updateContent(editingPage.key, JSON.stringify(editingPage.parsed));"
)

with open('src/pages/dashboard/PagesManager.tsx', 'w') as f:
    f.write(content)
