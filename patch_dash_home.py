import re

with open('src/pages/dashboard/DashboardHome.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'const unreadMessages = messages.filter((m: any) => !m.is_read).length;',
    'const unreadMessages = (messages || []).filter((m: any) => !m?.is_read).length;'
)
content = content.replace('contents.length', '(contents || []).length')
content = content.replace('mediaFiles.length', '(mediaFiles || []).length')

with open('src/pages/dashboard/DashboardHome.tsx', 'w') as f:
    f.write(content)
