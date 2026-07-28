import re

with open('src/pages/public/BlogDetails.tsx', 'r') as f:
    content = f.read()

schema_code = """      <SEO 
        title={`${post.title} | المدونة | شركة زجاج الرياض`} 
        description={post.excerpt}
        image={post.image}
        structuredData={{
          "@type": "BlogPosting",
          "headline": post.title,
          "image": post.image,
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
          "datePublished": post.date,
          "description": post.excerpt
        }}
      />"""

content = re.sub(r'<SEO\s+title=\{`\$\{post\.title\}\s*\|\s*المدونة\s*\|\s*شركة زجاج الرياض`\}\s*description=\{post\.excerpt\}\s*/>', schema_code, content, flags=re.DOTALL)

with open('src/pages/public/BlogDetails.tsx', 'w') as f:
    f.write(content)
