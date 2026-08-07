import re

with open('src/pages/dashboard/PagesManager.tsx', 'r') as f:
    content = f.read()

content = content.replace('{parsedPages.length === 0', '{(parsedPages || []).length === 0')
content = content.replace('parsedPages.map', '(parsedPages || []).map')

with open('src/pages/dashboard/PagesManager.tsx', 'w') as f:
    f.write(content)
