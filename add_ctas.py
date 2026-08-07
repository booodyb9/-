import re

with open('src/pages/public/Home.tsx', 'r') as f:
    content = f.read()

if "import SectionCTA" not in content:
    content = content.replace("import Blog from '../../components/Blog';", "import Blog from '../../components/Blog';\nimport SectionCTA from '../../components/SectionCTA';")

# Add CTA to services
content = re.sub(r'(<section id="services">.*?</section>)', r'\1\n      <div className="py-8 bg-gray-50"><SectionCTA /></div>', content, flags=re.DOTALL, count=1)

# Add CTA to why-us
content = re.sub(r'(<section id="why-us">.*?</section>)', r'\1\n      <div className="py-8 bg-white"><SectionCTA /></div>', content, flags=re.DOTALL, count=1)

# Add CTA to gallery
content = re.sub(r'(<section id="gallery">.*?</section>)', r'\1\n      <div className="py-8 bg-[#0a0a0a]"><SectionCTA /></div>', content, flags=re.DOTALL, count=1)

with open('src/pages/public/Home.tsx', 'w') as f:
    f.write(content)

print("Home.tsx updated with CTAs")
