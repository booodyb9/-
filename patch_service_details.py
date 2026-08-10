with open('src/pages/public/ServiceDetails.tsx', 'r') as f:
    content = f.read()

target = """        const found = services.find((s: any) => 
          s.title === decodeURIComponent(slug || '') || 
          s.title.replace(/\s+/g, '-').toLowerCase() === slug
        );"""
replacement = """        const found = services.find((s: any) => 
          !s.isHidden && (
            s.title === decodeURIComponent(slug || '') || 
            s.title.replace(/\\s+/g, '-').toLowerCase() === slug
          )
        );"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/pages/public/ServiceDetails.tsx', 'w') as f:
        f.write(content)
    print("ServiceDetails patched")
else:
    print("ServiceDetails target not found")
