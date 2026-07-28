import re

with open('src/pages/public/ServiceDetails.tsx', 'r') as f:
    content = f.read()

schema_code = """      <SEO 
        title={`${service.title} | شركة زجاج الرياض`} 
        description={service.description}
        image={service.image}
        structuredData={{
          "@type": "Service",
          "name": service.title,
          "description": service.description,
          "provider": {
            "@type": "HomeAndConstructionBusiness",
            "name": "شركة زجاج الرياض",
            "image": "https://riyadh-glass.ai.studio/og-image.jpg"
          },
          "image": service.image,
          "areaServed": "الرياض"
        }}
      />"""

content = re.sub(r'<SEO\s+title=\{`\$\{service\.title\}\s*\|\s*شركة زجاج الرياض`\}\s*description=\{service\.description\}\s*/>', schema_code, content, flags=re.DOTALL)

with open('src/pages/public/ServiceDetails.tsx', 'w') as f:
    f.write(content)
