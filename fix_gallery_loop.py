with open('src/components/GallerySlider.tsx', 'r') as f:
    content = f.read()

content = content.replace('centeredSlides={true}', 'centeredSlides={true}\n          loop={true}')

with open('src/components/GallerySlider.tsx', 'w') as f:
    f.write(content)
