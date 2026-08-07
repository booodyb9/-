content = open('src/pages/public/DynamicPage.tsx').read()

schema_code = """
  const pageSchema = pageData && pageData !== 'not_found' ? {
    "@type": "WebPage",
    "name": pageData.seoTitle || pageData.title,
    "description": pageData.seoDescription || pageData.description
  } : undefined;
"""

content = content.replace("  if (pageData === 'not_found' || (!pageData && !loading)) {", schema_code + "\n  if (pageData === 'not_found' || (!pageData && !loading)) {")
content = content.replace("<SEO title={`${pageData.seoTitle || pageData.title}`}", "<SEO title={`${pageData.seoTitle || pageData.title}`} description={pageData.seoDescription || pageData.description} image={pageData.featuredImage} structuredData={pageSchema}")

open('src/pages/public/DynamicPage.tsx', 'w').write(content)
