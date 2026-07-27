import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("const { contents, refreshContent: fetchContents, mediaFiles, fetchMedia, forceRefresh } = (useContent as any)();", "const { contents, refreshContent: fetchContents, mediaFiles, fetchMedia, forceRefresh } = useContent();")

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
