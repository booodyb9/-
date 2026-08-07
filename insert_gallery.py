import re

with open('src/pages/public/Home.tsx', 'r') as f:
    content = f.read()

gallery_regex = re.compile(r'(</section>\s*<section id="partners">)', re.DOTALL)
content = gallery_regex.sub(r'</section>\n      <GallerySlider />\n      <section id="partners">', content)

with open('src/pages/public/Home.tsx', 'w') as f:
    f.write(content)

print("Home.tsx updated with GallerySlider")
