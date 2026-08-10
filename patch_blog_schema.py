content = open('src/pages/public/BlogDetails.tsx').read()

schema_code = """
  const articleSchema = post ? {
    "@type": "Article",
    "headline": post.title,
    "image": post.image,
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": "شركة زجاج الرياض"
    },
    "publisher": {
      "@type": "Organization",
      "name": "شركة زجاج الرياض",
      "logo": {
        "@type": "ImageObject",
        "url": "https://riyadh-glass.ai.studio/og-image.jpg"
      }
    },
    "description": post.excerpt
  } : undefined;
"""

content = content.replace("  if (!post) {", schema_code + "\n  if (!post) {")
content = content.replace("<SEO title={`${post.title} | المدونة`}", "<SEO title={`${post.title} | المدونة`} description={post.excerpt} image={post.image} structuredData={articleSchema}")

open('src/pages/public/BlogDetails.tsx', 'w').write(content)
