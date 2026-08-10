import re

with open('src/pages/dashboard/ContentManager.tsx', 'r') as f:
    content = f.read()

# Let's find the start of services_items and replace the schema array
start = content.find("key: 'services_items',")
if start != -1:
    end_of_schema = content.find("]", start)
    if end_of_schema != -1:
        start_of_schema = content.find("schema: [", start) + len("schema: [")
        replacement = """
      { key: 'title', label: 'عنوان الخدمة', type: 'text' },
      { key: 'description', label: 'وصف الخدمة', type: 'textarea' },
      { key: 'image', label: 'الصورة الرئيسية', type: 'image' },
      { key: 'bgImage', label: 'صورة الخلفية', type: 'image' },
      { key: 'icon', label: 'اسم الأيقونة (مثال: Home)', type: 'text' },
      { key: 'isHidden', label: 'إخفاء الخدمة', type: 'boolean' },
      { key: 'seoTitle', label: 'SEO عنوان', type: 'text' },
      { key: 'seoDescription', label: 'SEO وصف', type: 'textarea' },
      { key: 'seoKeywords', label: 'SEO كلمات مفتاحية', type: 'text' },
      { key: 'seoCanonical', label: 'SEO Canonical URL', type: 'text' },
      { key: 'seoImage', label: 'SEO OG Image', type: 'image' },
      { key: 'seoNoIndex', label: 'منع الأرشفة (NoIndex)', type: 'boolean' },
    """
        content = content[:start_of_schema] + replacement + content[end_of_schema:]
        with open('src/pages/dashboard/ContentManager.tsx', 'w') as f:
            f.write(content)
        print("Patched successfully")
    else:
        print("End of schema not found")
else:
    print("services_items not found")
