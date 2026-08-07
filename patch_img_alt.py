import os

files = [
    'src/pages/public/ProjectDetails.tsx',
    'src/pages/public/ServiceDetails.tsx',
    'src/pages/public/BlogDetails.tsx',
    'src/components/RecentProjects.tsx',
    'src/components/Services.tsx',
    'src/components/Blog.tsx'
]

for filepath in files:
    if os.path.exists(filepath):
        content = open(filepath).read()
        content = content.replace("alt=\"صورة\"", "alt={project?.title || service?.title || post?.title || item?.title || 'صورة'}")
        content = content.replace("alt={'صورة'}", "alt={project?.title || service?.title || post?.title || item?.title || 'صورة'}")
        open(filepath, 'w').write(content)

