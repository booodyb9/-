content = open('src/pages/public/ProjectDetails.tsx').read()
replacement = """
      <SEO 
        title={`${project.seoTitle || project.title} | زجاج الرياض`} 
        description={project.seoDescription || project.description}
        keywords={project.seoKeywords}
        canonical={project.seoCanonical}
        image={project.seoImage || project.coverImage}
        noindex={project.seoNoIndex}
      />
"""
content = content.replace("<SEO \n        title={`${project.seoTitle || project.title} | زجاج الرياض`} \n        description={project.seoDescription || project.description} \n      />", replacement)
open('src/pages/public/ProjectDetails.tsx', 'w').write(content)
