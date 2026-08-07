import re

with open('src/pages/dashboard/MediaLibrary.tsx', 'r') as f:
    content = f.read()

content = content.replace('{filteredMedia.length === 0', '{(filteredMedia || []).length === 0')
content = content.replace('filteredMedia.map', '(filteredMedia || []).map')

with open('src/pages/dashboard/MediaLibrary.tsx', 'w') as f:
    f.write(content)
