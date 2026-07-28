import re

with open('src/components/SplashAnimation.tsx', 'r') as f:
    content = f.read()

content = content.replace('<motion.h1', '<motion.div')
content = content.replace('</motion.h1>', '</motion.div>')

with open('src/components/SplashAnimation.tsx', 'w') as f:
    f.write(content)
