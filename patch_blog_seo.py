content = open('src/pages/public/BlogDetails.tsx').read()
replacement = """
      <SEO 
        title={post.seoTitle || `${post.title} | المدونة | شركة زجاج الرياض`} 
        description={post.seoDescription || post.excerpt}
        keywords={post.seoKeywords}
        canonical={post.seoCanonical}
        image={post.seoImage || post.image}
        noindex={post.seoNoIndex}
        structuredData={{
"""
content = content.replace("<SEO \n        title={`${post.title} | المدونة | شركة زجاج الرياض`} \n        description={post.excerpt}\n        image={post.image}\n        structuredData={{", replacement)
open('src/pages/public/BlogDetails.tsx', 'w').write(content)
