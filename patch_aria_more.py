import re

with open('src/components/Gallery.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'onClick={() => setLightboxIndex(null)}',
    'aria-label="Close Lightbox" onClick={() => setLightboxIndex(null)}'
)
with open('src/components/Gallery.tsx', 'w') as f:
    f.write(content)

with open('src/components/Navbar.tsx', 'r') as f:
    nav_content = f.read()
    
nav_content = nav_content.replace(
    'onClick={() => setMobileMenuOpen(!mobileMenuOpen)}',
    'aria-label="Toggle Mobile Menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}'
)
nav_content = nav_content.replace(
    'onClick={() => setIsOpen(false)}',
    'aria-label="Close Mobile Menu" onClick={() => setIsOpen(false)}'
)

with open('src/components/Navbar.tsx', 'w') as f:
    f.write(nav_content)
