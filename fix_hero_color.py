import re

with open('src/components/Hero.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] to-[#0284C7] italic pr-2">الزجاج الحديث</span>',
    '<span className="text-[#0284C7] italic pr-2">الزجاج الحديث</span>'
)
content = content.replace(
    '<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] to-[#0284C7] italic">Modern Glass</span>',
    '<span className="text-[#0284C7] italic">Modern Glass</span>'
)

with open('src/components/Hero.tsx', 'w') as f:
    f.write(content)
