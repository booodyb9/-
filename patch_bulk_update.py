import re

with open('src/pages/dashboard/BulkGalleryUpload.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "const { refreshContent } = useContent();",
    "const { refreshContent, updateContent } = useContent();"
)

content = content.replace(
    "await saveContent('premium_portfolio_projects', 'Premium Portfolio Projects', 'json', JSON.stringify(projects));",
    "await saveContent('premium_portfolio_projects', 'Premium Portfolio Projects', 'json', JSON.stringify(projects));\n        updateContent('premium_portfolio_projects', JSON.stringify(projects));"
)

with open('src/pages/dashboard/BulkGalleryUpload.tsx', 'w') as f:
    f.write(content)
