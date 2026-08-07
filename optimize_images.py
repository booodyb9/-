import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # We will search for <img ... >
    # If it lacks loading= or decoding=, we can add it.
    
    # Simple regex to find <img tags
    def replacer(match):
        img_tag = match.group(0)
        # Don't modify if it has loading="eager" or loading="lazy" already
        if 'loading=' not in img_tag:
            # insert loading="lazy" decoding="async" after <img
            img_tag = img_tag.replace('<img', '<img loading="lazy" decoding="async"')
        return img_tag

    new_content = re.sub(r'<img[^>]*>', replacer, content)

    if content != new_content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Optimized images in {filepath}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith(('.tsx', '.jsx', '.ts', '.js')):
            process_file(os.path.join(root, file))

print("Image optimization complete.")
