import re

with open('src/pages/public/Home.tsx', 'r') as f:
    content = f.read()

# Make sure Hero is imported
if "import Hero" not in content:
    content = content.replace("import Navbar from '../../components/Navbar';", "import Navbar from '../../components/Navbar';\nimport Hero from '../../components/Hero';")

# Replace inline <section id="hero"> with <Hero />
hero_regex = re.compile(r'<section id="hero">.*?</section>', re.DOTALL)
content = hero_regex.sub('<Hero />', content)

with open('src/pages/public/Home.tsx', 'w') as f:
    f.write(content)

print("Home.tsx updated to use Hero component")
