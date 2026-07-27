import re

with open('src/pages/dashboard/PagesManager.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "await saveContent(editingPage.key, editingPage.parsed.title, 'page', JSON.stringify(editingPage.parsed));",
    "await saveContent(editingPage.key, editingPage.parsed.title, 'page', JSON.stringify(editingPage.parsed));\n      updateContent(editingPage.key, JSON.stringify(editingPage.parsed));"
)

with open('src/pages/dashboard/PagesManager.tsx', 'w') as f:
    f.write(content)
