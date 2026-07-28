import re

with open('src/components/SEO.tsx', 'r') as f:
    content = f.read()

# I will add aggregateRating inside HomeAndConstructionBusiness
agg_rating = """        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5.0",
          "reviewCount": "150"
        },
        "areaServed": "الرياض","""

content = content.replace('"areaServed": "الرياض",', agg_rating)

with open('src/components/SEO.tsx', 'w') as f:
    f.write(content)
