import re

with open('src/pages/public/Home.tsx', 'r') as f:
    content = f.read()

# Make sure Blog is imported
if "import Blog" not in content:
    content = content.replace("import GallerySlider from '../../components/GallerySlider';", "import GallerySlider from '../../components/GallerySlider';\nimport Blog from '../../components/Blog';")

# Add <Blog /> after the existing faq section
blog_regex = re.compile(r'(</section>\s*<section id="contact">)', re.DOTALL)
content = blog_regex.sub(r'</section>\n      <Blog />\n      <section id="contact">', content)

with open('src/pages/public/Home.tsx', 'w') as f:
    f.write(content)

print("Home.tsx updated to include Blog")
