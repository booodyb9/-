with open('src/pages/public/ServicesPage.tsx', 'r') as f:
    content = f.read()

target = 'services.map((service, index) => ('
replacement = 'services.filter(s => !s.isHidden).map((service, index) => ('

if target in content:
    content = content.replace(target, replacement)
    with open('src/pages/public/ServicesPage.tsx', 'w') as f:
        f.write(content)
    print("ServicesPage patched")
else:
    print("ServicesPage target not found")
