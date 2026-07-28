import re

with open('index.html', 'r') as f:
    content = f.read()

head_injection = """
    <meta name="theme-color" content="#0284C7" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
"""

if 'name="theme-color"' not in content:
    content = content.replace('</head>', head_injection + '</head>')

with open('index.html', 'w') as f:
    f.write(content)
