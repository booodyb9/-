content = open('src/pages/public/ServiceDetails.tsx').read()

schema_code = """
  const serviceSchema = service ? {
    "@type": "Service",
    "name": service.title,
    "description": service.description,
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "name": "شركة زجاج الرياض",
      "image": "https://riyadh-glass.ai.studio/og-image.jpg"
    },
    "areaServed": "الرياض",
    "image": service.image
  } : undefined;
"""

content = content.replace("  if (!service) {", schema_code + "\n  if (!service) {")
content = content.replace("<SEO title={`${service.title} | خدماتنا`}", "<SEO title={`${service.title} | خدماتنا`} description={service.description} image={service.image} structuredData={serviceSchema}")

open('src/pages/public/ServiceDetails.tsx', 'w').write(content)
