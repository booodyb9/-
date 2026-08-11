import re

with open('src/components/GallerySlider.tsx', 'r') as f:
    content = f.read()

content = content.replace('className="absolute inset-0', 'className="!absolute inset-0')

with open('src/components/GallerySlider.tsx', 'w') as f:
    f.write(content)
