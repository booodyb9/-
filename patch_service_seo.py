content = open('src/pages/public/ServiceDetails.tsx').read()
replacement = """
      <SEO 
        title={service.seoTitle || `${service.title} | شركة زجاج الرياض`} 
        description={service.seoDescription || service.description}
        keywords={service.seoKeywords}
        canonical={service.seoCanonical}
        image={service.seoImage || service.image}
        noindex={service.seoNoIndex}
        structuredData={{
"""
content = content.replace("<SEO \n        title={`${service.title} | شركة زجاج الرياض`} \n        description={service.description}\n        image={service.image}\n        structuredData={{", replacement)
open('src/pages/public/ServiceDetails.tsx', 'w').write(content)
