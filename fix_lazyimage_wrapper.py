with open('src/components/LazyImage.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className={`relative overflow-hidden bg-gray-100 ${className || \'\'}`}>',
    '<div className={`relative overflow-hidden bg-gray-100 w-full h-full ${className || \'\'}`}>'
)

with open('src/components/LazyImage.tsx', 'w') as f:
    f.write(content)
