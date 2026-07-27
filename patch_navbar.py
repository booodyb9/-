import re

with open('src/components/Navbar.tsx', 'r') as f:
    content = f.read()

# Update Navbar background transition
content = content.replace(
    'isScrolled ? \'bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm\' : \'bg-white border-b border-transparent\'',
    'isScrolled ? \'bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-sm\' : \'bg-white/5 backdrop-blur-sm border-b border-transparent\''
)

# Actually, wait, if the Hero is dark, the white text won't be visible in the Navbar unless we do dark mode navbar. But the rest of the site is light.
# Let's see if we can make the Navbar conditionally light/dark based on scroll or page.
