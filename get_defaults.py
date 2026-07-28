import os
import re

if os.path.exists('src/components/Gallery.tsx'):
    with open('src/components/Gallery.tsx', 'r') as f:
        content = f.read()
        print("Does Gallery contain default?", "defaultProjects" in content)
