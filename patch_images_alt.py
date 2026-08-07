import os
import re

for root, _, files in os.walk('src'):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            path = os.path.join(root, f)
            content = open(path).read()
            # If alt= isn't present, or alt={undefined} we want to ensure some fallback.
            # Actually the easiest way to give an automatic alt text fallback is to replace alt={foo} with alt={foo || "صورة"}
            # Let's just do a regex replace on alt={([^}]+)} to alt={\1 || 'صورة'}
            # Wait, what if it's already a string like alt="Preview"? Then leave it.
            # What if it's alt={project.title}? We make it alt={project.title || 'صورة'}
            
            # Find all alt={...}
            def replacer(match):
                inner = match.group(1)
                if "||" not in inner and "&&" not in inner and "?" not in inner and "!" not in inner and not inner.startswith("`"):
                    return f"alt={{{inner} || 'صورة'}}"
                return match.group(0)
            
            new_content = re.sub(r'alt=\{([^}]+)\}', replacer, content)
            
            # For alt="" we can just replace it if we find it
            new_content = new_content.replace('alt=""', 'alt="صورة"')
            
            if content != new_content:
                open(path, 'w').write(new_content)
