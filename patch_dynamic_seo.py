content = open('src/pages/public/DynamicPage.tsx').read()
replacement = """
      <SEO 
        title={`${pageData.seo?.title || pageData.title} | شركة زجاج الرياض`} 
        description={pageData.seo?.description}
        keywords={pageData.seo?.keywords}
        canonical={pageData.seo?.canonical}
        image={pageData.seo?.ogImage}
        noindex={pageData.seo?.noindex}
      />
"""
content = content.replace("<SEO \n        title={`${pageData.seo?.title || pageData.title} | شركة زجاج الرياض`} \n        description={pageData.seo?.description}\n        keywords={pageData.seo?.keywords}\n      />", replacement)
open('src/pages/public/DynamicPage.tsx', 'w').write(content)
