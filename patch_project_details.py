content = open('src/pages/public/ProjectDetails.tsx').read()

schema_code = """
  const projectSchema = project ? {
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "image": project.coverImage,
    "dateCreated": project.date,
    "author": {
      "@type": "HomeAndConstructionBusiness",
      "name": "شركة زجاج الرياض"
    }
  } : undefined;
"""

content = content.replace("  if (!project) {", schema_code + "\n  if (!project) {")
content = content.replace("<SEO title={`${project.title} | مشاريعنا`}", "<SEO title={`${project.title} | مشاريعنا`} description={project.description} image={project.coverImage} structuredData={projectSchema}")

open('src/pages/public/ProjectDetails.tsx', 'w').write(content)
