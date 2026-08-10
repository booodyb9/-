with open('index.html', 'r') as f:
    content = f.read()

preload_tags = """
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" />
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet" media="print" onload="this.media='all'" />
    <noscript>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet" />
    </noscript>
"""

# Replace existing font link
import re
content = re.sub(r'<link rel="preconnect" href="https://fonts.googleapis.com" />.*?<link href="https://fonts.googleapis.com/css2\?family=Tajawal.*?rel="stylesheet" />', preload_tags.strip(), content, flags=re.DOTALL)

with open('index.html', 'w') as f:
    f.write(content)

print("index.html patched")
