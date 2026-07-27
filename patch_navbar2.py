import re

with open('src/components/Navbar.tsx', 'r') as f:
    content = f.read()

# I will just keep the Navbar as bg-white ALWAYS because it's safer and still looks premium, like Vercel/Linear sometimes do (a clean solid or frosted header). Let's use `bg-white/80 backdrop-blur-xl border-b border-gray-100` always.

content = content.replace(
    "${isScrolled ? 'bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-sm' : 'bg-white/5 backdrop-blur-sm border-b border-transparent'}",
    "${isScrolled ? 'bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm' : 'bg-white border-b border-transparent'}"
)

# And if I messed up the first patch, I will just fix it:
content = re.sub(r'className={`fixed w-full z-50 transition-all duration-300 \$\{isScrolled \? .*? \: .*?\}`}', 
                 "className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm' : 'bg-white border-b border-gray-100'}`}", 
                 content)

with open('src/components/Navbar.tsx', 'w') as f:
    f.write(content)
