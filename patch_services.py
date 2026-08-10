with open('src/components/Services.tsx', 'r') as f:
    content = f.read()

target = "{services.map((service, index) => ("
replacement = "{services.filter(s => !s.isHidden).map((service, index) => ("

if target in content:
    content = content.replace(target, replacement)
    with open('src/components/Services.tsx', 'w') as f:
        f.write(content)
    print("Services patched")
else:
    print("Services target not found")
