content = open('src/pages/public/NotFound.tsx').read()
content = content.replace("<SEO title=\"الصفحة غير موجودة | 404\" />", "<SEO title=\"الصفحة غير موجودة | 404\" noindex={true} />")
open('src/pages/public/NotFound.tsx', 'w').write(content)
