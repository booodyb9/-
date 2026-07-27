import re

with open('src/components/Navbar.tsx', 'r') as f:
    content = f.read()

# Replace the black contact button with a nicer premium one
content = content.replace(
    'className="bg-[#111827] text-white px-6 py-2 text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"',
    'className="bg-[#0F172A] text-white px-6 py-2.5 text-sm font-semibold rounded-full hover:bg-[#0284C7] hover:shadow-lg hover:shadow-[#0284C7]/20 transition-all duration-300 flex items-center gap-2"'
)
content = content.replace(
    'className="w-full text-center bg-[#111827] text-white px-6 py-3 font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"',
    'className="w-full text-center bg-[#0F172A] text-white px-6 py-3 font-semibold rounded-full hover:bg-[#0284C7] transition-all duration-300 flex items-center justify-center gap-2"'
)

# And rounded logo
content = content.replace(
    'className="w-8 h-8 bg-[#0284C7] rounded-sm flex items-center justify-center text-white"',
    'className="w-8 h-8 bg-gradient-to-br from-[#0284C7] to-[#0369A1] rounded-lg shadow-sm flex items-center justify-center text-white"'
)

with open('src/components/Navbar.tsx', 'w') as f:
    f.write(content)
