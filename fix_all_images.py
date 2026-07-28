import os
import glob
import re

files = glob.glob('src/**/*.tsx', recursive=True)
for file in files:
    if file == 'src/components/Hero.tsx':
        continue
    with open(file, 'r') as f:
        content = f.read()

    # If it contains <img
    if '<img' in content:
        # First remove existing loading attributes to avoid duplicates
        content = re.sub(r'\s+loading=["\']lazy["\']', '', content)
        content = re.sub(r'\s+decoding=["\']async["\']', '', content)
        # Then add them back to all <img tags
        content = content.replace('<img', '<img loading="lazy" decoding="async"')
        
        with open(file, 'w') as f:
            f.write(content)
