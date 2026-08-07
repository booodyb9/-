import re

with open('src/pages/dashboard/PagesManager.tsx', 'r') as f:
    content = f.read()

content = content.replace('editingPage.parsed.title', 'editingPage.parsed?.title')
content = content.replace('editingPage.parsed.slug', 'editingPage.parsed?.slug')
content = content.replace('editingPage.parsed.status', 'editingPage.parsed?.status')
content = content.replace('editingPage.parsed.featuredImage', 'editingPage.parsed?.featuredImage')
content = content.replace('editingPage.parsed.seo', 'editingPage.parsed?.seo')

with open('src/pages/dashboard/PagesManager.tsx', 'w') as f:
    f.write(content)
