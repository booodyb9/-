import re

with open('src/components/SEO.tsx', 'r') as f:
    content = f.read()

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

content = content.replace("const defaultData = defaultSeoData[language];", breadcrumb_logic + "\n  const defaultData = defaultSeoData[language];")

content = content.replace(
    '"inLanguage": "ar-SA"\n      }\n    ]\n  };',
    '"inLanguage": "ar-SA",\n        "breadcrumb": { "@id": `${url}#breadcrumb` }\n      },\n      breadcrumbList\n    ]\n  };'
)

with open('src/components/SEO.tsx', 'w') as f:
    f.write(content)
