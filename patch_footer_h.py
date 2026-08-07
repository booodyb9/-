content = open('src/components/Footer.tsx').read()
content = content.replace("<h4", "<h3").replace("</h4", "</h3")
open('src/components/Footer.tsx', 'w').write(content)
