import re

with open('src/components/Gallery.tsx', 'r') as f:
    content = f.read()

content = content.replace('ArrowUpRight, ZoomIn } from \'lucide-react\';', 'ArrowUpRight, ZoomIn, ArrowLeft } from \'lucide-react\';')

with open('src/components/Gallery.tsx', 'w') as f:
    f.write(content)
