import re

with open('src/pages/dashboard/Messages.tsx', 'r') as f:
    content = f.read()

content = content.replace('{messages.length}', '{(messages || []).length}')
content = content.replace('{messages.length === 0', '{(messages || []).length === 0')
content = content.replace('messages.map', '(messages || []).map')

with open('src/pages/dashboard/Messages.tsx', 'w') as f:
    f.write(content)
