import re

with open('src/pages/dashboard/MediaLibrary.tsx', 'r') as f:
    content = f.read()

content = content.replace('mediaFiles.find', '(mediaFiles || []).find')
content = content.replace('mediaFiles.filter', '(mediaFiles || []).filter')

with open('src/pages/dashboard/MediaLibrary.tsx', 'w') as f:
    f.write(content)
