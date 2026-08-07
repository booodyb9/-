import re

with open('src/pages/dashboard/PagesManager.tsx', 'r') as f:
    content = f.read()

content = content.replace('pages.map(', '(pages || []).map(')

with open('src/pages/dashboard/PagesManager.tsx', 'w') as f:
    f.write(content)
