import re

with open('src/components/Testimonials.tsx', 'r') as f:
    content = f.read()

import_helmet = "import { Helmet } from 'react-helmet-async';\n"
if "import { Helmet } from 'react-helmet-async';" not in content:
    content = content.replace("import { useMemo }", import_helmet + "import { useMemo }")

schema_code = """
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": testimonials.map((testimonial, idx) => ({
              "@type": "Review",
              "position": idx + 1,
              "author": {
                "@type": "Person",
                "name": testimonial.name
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": testimonial.rating || 5,
                "bestRating": 5
              },
              "reviewBody": testimonial.content,
              "itemReviewed": {
                "@type": "HomeAndConstructionBusiness",
                "name": "شركة زجاج الرياض"
              }
            }))
          })}
        </script>
      </Helmet>
"""

content = content.replace('<div className="max-w-7xl', schema_code + '      <div className="max-w-7xl')

with open('src/components/Testimonials.tsx', 'w') as f:
    f.write(content)
