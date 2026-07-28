import re

files = ['src/components/Testimonials.tsx', 'src/components/Gallery.tsx', 'src/components/Hero.tsx']

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    # Add aria-label to swiper next button if not present
    content = re.sub(r'(<button[^>]*class(?:Name)?=["\'][^"\']*next[^"\']*["\'][^>]*)>', r'\1 aria-label="Next Slide">', content)
    # Add aria-label to swiper prev button if not present
    content = re.sub(r'(<button[^>]*class(?:Name)?=["\'][^"\']*prev[^"\']*["\'][^>]*)>', r'\1 aria-label="Previous Slide">', content)

    # Clean up double aria-labels just in case
    content = content.replace(' aria-label="Next Slide" aria-label="Next Slide">', ' aria-label="Next Slide">')
    content = content.replace(' aria-label="Previous Slide" aria-label="Previous Slide">', ' aria-label="Previous Slide">')

    with open(file, 'w') as f:
        f.write(content)
