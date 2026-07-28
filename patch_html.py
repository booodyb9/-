import re

with open('index.html', 'r') as f:
    content = f.read()

# Remove any existing font links if any
# Inject font preconnects
head_injection = """
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet" />
    <link rel="preconnect" href="https://ugvdoabczcnxluzxehga.supabase.co" crossorigin />
"""

if "https://fonts.googleapis.com/css2" not in content:
    content = content.replace('</head>', head_injection + '</head>')

with open('index.html', 'w') as f:
    f.write(content)

with open('src/index.css', 'r') as f:
    css_content = f.read()

css_content = css_content.replace("@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');", "")

with open('src/index.css', 'w') as f:
    f.write(css_content)
