import re

with open('src/components/Footer.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<Building2 className="h-6 w-6 text-[#0284C7]" />',
    '<div className="w-8 h-8 bg-gradient-to-br from-[#0284C7] to-[#0369A1] rounded-lg shadow-sm flex items-center justify-center text-white"><Building2 className="h-5 w-5" /></div>'
)

# And add hover effect for social icons
content = content.replace(
    'className="w-10 h-10 rounded-sm bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#0284C7] hover:text-white transition-colors"',
    'className="w-10 h-10 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-[#0284C7] hover:border-[#0284C7] hover:text-white transition-all duration-300"'
)

with open('src/components/Footer.tsx', 'w') as f:
    f.write(content)
