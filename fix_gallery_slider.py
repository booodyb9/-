with open('src/components/GallerySlider.tsx', 'r') as f:
    content = f.read()

content = content.replace("style={{ width: '300px', height: '400px', md: {width: '500px', height: '500px'} } as any}", "className=\"w-[300px] h-[400px] md:w-[500px] md:h-[500px] relative rounded-xl overflow-hidden shadow-2xl group\"")
content = content.replace("className=\"relative rounded-xl overflow-hidden shadow-2xl group\"", "")

with open('src/components/GallerySlider.tsx', 'w') as f:
    f.write(content)
