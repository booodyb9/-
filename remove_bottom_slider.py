with open('src/pages/public/Home.tsx', 'r') as f:
    content = f.read()

# The content has <GallerySlider /> inserted after Hero. The old one is at the bottom.
# Let's replace the last occurrence of <GallerySlider /> with nothing.
parts = content.rsplit('<GallerySlider />', 1)
if len(parts) == 2:
    content = parts[0] + parts[1]

with open('src/pages/public/Home.tsx', 'w') as f:
    f.write(content)
