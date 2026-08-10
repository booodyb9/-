import re

with open('src/pages/public/Home.tsx', 'r') as f:
    content = f.read()

# Make sure GallerySlider is imported
if "import GallerySlider" not in content:
    content = content.replace("import Hero from '../../components/Hero';", "import Hero from '../../components/Hero';\nimport GallerySlider from '../../components/GallerySlider';")

# Add <GallerySlider /> after the existing gallery section
gallery_regex = re.compile(r'(</section>\s*<section id="why-us">)', re.DOTALL)
content = gallery_regex.sub(r'</section>\n      <GallerySlider />\n      <section id="why-us">', content)

with open('src/pages/public/Home.tsx', 'w') as f:
    f.write(content)

print("Home.tsx updated to include GallerySlider")
