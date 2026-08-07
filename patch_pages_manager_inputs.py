import re

with open('src/pages/dashboard/PagesManager.tsx', 'r') as f:
    content = f.read()

# Replace direct access with fallback to empty string
content = content.replace('value={editingPage.parsed.title}', "value={editingPage.parsed?.title || ''}")
content = content.replace('value={editingPage.parsed.slug}', "value={editingPage.parsed?.slug || ''}")
content = content.replace('value={editingPage.parsed.content || \'\'}', "value={editingPage.parsed?.content || ''}")
content = content.replace('value={editingPage.parsed.seo?.title}', "value={editingPage.parsed?.seo?.title || ''}")
content = content.replace('value={editingPage.parsed.seo?.description}', "value={editingPage.parsed?.seo?.description || ''}")
content = content.replace('value={editingPage.parsed.status}', "value={editingPage.parsed?.status || 'draft'}")
content = content.replace('(editingPage.parsed.sections || [])', '(editingPage.parsed?.sections || [])')

with open('src/pages/dashboard/PagesManager.tsx', 'w') as f:
    f.write(content)
