import re

with open('src/pages/public/Home.tsx', 'r') as f:
    content = f.read()

# Add CTA to process
content = re.sub(r'(<section id="process">.*?</section>)', r'\1\n      <div className="py-8 bg-gray-50"><SectionCTA /></div>', content, flags=re.DOTALL, count=1)

# Add CTA to testimonials
content = re.sub(r'(<section id="testimonials">.*?</section>)', r'\1\n      <div className="py-8 bg-white"><SectionCTA /></div>', content, flags=re.DOTALL, count=1)

# Add CTA to faq
content = re.sub(r'(<section id="faq">.*?</section>)', r'\1\n      <div className="py-8 bg-gray-50"><SectionCTA /></div>', content, flags=re.DOTALL, count=1)

# Add CTA to blog
# Blog component is embedded as <Blog />
content = content.replace("<Blog />", '<Blog />\n      <div className="py-8 bg-white"><SectionCTA /></div>')

with open('src/pages/public/Home.tsx', 'w') as f:
    f.write(content)

print("Home.tsx updated with more CTAs")
