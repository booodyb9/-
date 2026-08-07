import re

with open('src/pages/public/Home.tsx', 'r') as f:
    content = f.read()

# Add imports for Navbar and Footer if not present
if "import Navbar" not in content:
    content = content.replace("import SEO from '../../components/SEO';", "import SEO from '../../components/SEO';\nimport Navbar from '../../components/Navbar';\nimport Footer from '../../components/Footer';")

# Remove the inline <nav> section
nav_regex = re.compile(r'<nav id="nav".*?</nav>', re.DOTALL)
content = nav_regex.sub('<Navbar />', content)

# Remove the inline <footer> section
footer_regex = re.compile(r'<footer id="footer".*?</footer>', re.DOTALL)
content = footer_regex.sub('<Footer />', content)

with open('src/pages/public/Home.tsx', 'w') as f:
    f.write(content)

print("Home.tsx refactored to use components")
