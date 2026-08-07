import os
import re

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()
            
            # Find all <img that don't have loading="lazy" (and are not eager)
            # This is a bit tricky with regex, we can just do a simple replacement if needed, 
            # but we already verified most of them have it. 
