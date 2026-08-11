with open('src/pages/public/Home.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="why-img-card reveal fade-left delay-400">',
    '<div className="why-img-card reveal fade-left delay-400 aspect-[4/3] md:aspect-square">'
)

with open('src/pages/public/Home.tsx', 'w') as f:
    f.write(content)
