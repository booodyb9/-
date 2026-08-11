with open('src/components/GallerySlider.tsx', 'r') as f:
    content = f.read()

content = content.replace('id="gallery-slider"', '')

with open('src/components/GallerySlider.tsx', 'w') as f:
    f.write(content)
