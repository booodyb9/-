import re

with open('src/components/SEO.tsx', 'r') as f:
    content = f.read()

# I will extract breadcrumb logic and place it after url is defined.
content = content.replace("""  const pathParts = path.split('/').filter(p => p);
  const breadcrumbList = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": language === 'ar' ? 'الرئيسية' : 'Home',
        "item": baseUrl
      },
      ...pathParts.map((part, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": decodeURIComponent(part),
        "item": `${baseUrl}/${pathParts.slice(0, index + 1).join('/')}`
      }))
    ]
  };

  const defaultData = defaultSeoData[language];""", "  const defaultData = defaultSeoData[language];")

breadcrumb_logic = """
  const pathParts = path.split('/').filter(p => p);
  const breadcrumbList = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": language === 'ar' ? 'الرئيسية' : 'Home',
        "item": baseUrl
      },
      ...pathParts.map((part, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": decodeURIComponent(part),
        "item": `${baseUrl}/${pathParts.slice(0, index + 1).join('/')}`
      }))
    ]
  };
"""

content = content.replace("const ogImage = image || `${baseUrl}/og-image.jpg`;", "const ogImage = image || `${baseUrl}/og-image.jpg`;\n" + breadcrumb_logic)

with open('src/components/SEO.tsx', 'w') as f:
    f.write(content)
