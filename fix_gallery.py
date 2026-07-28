import re

with open('src/components/Gallery.tsx', 'r') as f:
    content = f.read()

content = content.replace('loading="lazy" decoding="async"', '')
content = content.replace('<img ', '<img loading="lazy" decoding="async" ')
content = content.replace('loading="lazy"\n', '\n')

with open('src/components/Gallery.tsx', 'w') as f:
    f.write(content)
