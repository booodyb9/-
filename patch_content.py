content = open('src/pages/dashboard/ContentManager.tsx').read()
services_schema = """
      { key: 'icon', label: 'اسم الأيقونة (مثال: Home)', type: 'text' },
      { key: 'seoTitle', label: 'SEO عنوان', type: 'text' },
      { key: 'seoDescription', label: 'SEO وصف', type: 'textarea' },
      { key: 'seoKeywords', label: 'SEO كلمات مفتاحية', type: 'text' },
      { key: 'seoCanonical', label: 'SEO Canonical URL', type: 'text' },
      { key: 'seoImage', label: 'SEO OG Image', type: 'image' },
      { key: 'seoNoIndex', label: 'منع الأرشفة (NoIndex)', type: 'boolean' },
"""
content = content.replace("{ key: 'icon', label: 'اسم الأيقونة (مثال: Home)', type: 'text' },", services_schema)

blog_schema = """
      { key: 'image', label: 'رابط الصورة', type: 'image' },
      { key: 'seoTitle', label: 'SEO عنوان', type: 'text' },
      { key: 'seoDescription', label: 'SEO وصف', type: 'textarea' },
      { key: 'seoKeywords', label: 'SEO كلمات مفتاحية', type: 'text' },
      { key: 'seoCanonical', label: 'SEO Canonical URL', type: 'text' },
      { key: 'seoImage', label: 'SEO OG Image', type: 'image' },
      { key: 'seoNoIndex', label: 'منع الأرشفة (NoIndex)', type: 'boolean' },
"""
content = content.replace("{ key: 'image', label: 'رابط الصورة', type: 'image' },", blog_schema)

open('src/pages/dashboard/ContentManager.tsx', 'w').write(content)
