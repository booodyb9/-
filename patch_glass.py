import re

with open('src/components/GlassVisualizer.tsx', 'r') as f:
    content = f.read()

# Make the section padding consistent and the text look premium
content = content.replace('bg-white', 'bg-gray-50')
content = content.replace('text-[#0284C7] text-sm font-bold tracking-widest uppercase mb-3', 'text-[#0ea5e9] text-sm font-bold tracking-widest uppercase mb-4')
content = content.replace('text-3xl md:text-5xl font-extrabold text-[#0F172A] leading-tight mb-4', 'text-4xl md:text-5xl font-extrabold text-[#0F172A] leading-tight mb-6 tracking-tight')

with open('src/components/GlassVisualizer.tsx', 'w') as f:
    f.write(content)
