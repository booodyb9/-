import re

with open('src/pages/dashboard/HomepageBuilder.tsx', 'r') as f:
    content = f.read()

content = content.replace("  { id: 'partners', label: 'شركاء النجاح (Partners)' },\n  { id: 'portfolio', label: 'معرض الأعمال (Portfolio)' },", "  { id: 'partners', label: 'شركاء النجاح (Partners)' },")
content = content.replace("key={section.id}", "key={`${section.id}-${idx}`}")

with open('src/pages/dashboard/HomepageBuilder.tsx', 'w') as f:
    f.write(content)
