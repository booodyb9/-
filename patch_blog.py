import re

with open('src/components/Blog.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'text-[#0284C7] text-sm font-bold tracking-widest uppercase mb-3',
    'text-[#0ea5e9] text-sm font-bold tracking-widest uppercase mb-4'
)
content = content.replace(
    'text-3xl md:text-5xl font-extrabold text-[#0F172A] leading-tight mb-4',
    'text-4xl md:text-5xl font-extrabold text-[#0F172A] leading-tight mb-6 tracking-tight'
)
content = content.replace(
    'className="bg-white rounded-sm border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"',
    'className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 group flex flex-col"'
)
content = content.replace(
    'className="absolute top-4 right-4 bg-[#0284C7] text-white text-xs font-bold px-3 py-1 rounded-sm"',
    'className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#0ea5e9] text-xs font-bold px-4 py-1.5 rounded-full shadow-sm"'
)
content = content.replace(
    'hover:text-[#0284C7]',
    'hover:text-[#0ea5e9]'
)
content = content.replace(
    'text-[#0284C7]',
    'text-[#0ea5e9]'
)

with open('src/components/Blog.tsx', 'w') as f:
    f.write(content)
