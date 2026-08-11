with open('src/components/GallerySlider.tsx', 'r') as f:
    content = f.read()

content = content.replace('delay: 3000', 'delay: 2000')

with open('src/components/GallerySlider.tsx', 'w') as f:
    f.write(content)
