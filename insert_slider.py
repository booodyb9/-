with open('src/pages/public/Home.tsx', 'r') as f:
    content = f.read()

content = content.replace('<Hero />', '<Hero />\n\n      <GallerySlider />')

with open('src/pages/public/Home.tsx', 'w') as f:
    f.write(content)
