with open('server.js', 'r') as f:
    content = f.read()

if "import compression from 'compression';" not in content:
    content = content.replace("import express from 'express';", "import express from 'express';\nimport compression from 'compression';")

if "app.use(compression());" not in content:
    content = content.replace("app.use(express.json());", "app.use(compression());\napp.use(express.json());")

# Update static serving to include cache headers
static_old = "app.use(express.static(path.join(__dirname, 'dist')));"
static_new = "app.use(express.static(path.join(__dirname, 'dist'), { maxAge: '1y' }));"
content = content.replace(static_old, static_new)

with open('server.js', 'w') as f:
    f.write(content)

print("server.js patched for compression and caching")
