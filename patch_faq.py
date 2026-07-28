import re

with open('src/components/FAQ.tsx', 'r') as f:
    content = f.read()

import_helmet = "import { Helmet } from 'react-helmet-async';\n"
if "import { Helmet" not in content:
    content = content.replace("import { useState", import_helmet + "import { useState")

helmet_code = """
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })}
        </script>
      </Helmet>
"""

content = content.replace('<div className="max-w-4xl', helmet_code + '      <div className="max-w-4xl')

with open('src/components/FAQ.tsx', 'w') as f:
    f.write(content)
