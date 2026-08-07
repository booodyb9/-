with open('src/pages/dashboard/config.ts', 'r') as f:
    content = f.read()

content = content.replace("{ id: 'seo', label: 'إعدادات SEO', icon: Search },", "{ id: 'seo', label: 'إعدادات SEO', icon: Search },\n      { id: 'performance', label: 'فحص الأداء والسرعة', icon: Activity },")

with open('src/pages/dashboard/config.ts', 'w') as f:
    f.write(content)
