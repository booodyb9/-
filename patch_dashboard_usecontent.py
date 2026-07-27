import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("const { contents, refreshContent: fetchContents } = useContent();", "const { contents, refreshContent: fetchContents, mediaFiles, fetchMedia, forceRefresh } = (useContent as any)();")

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
