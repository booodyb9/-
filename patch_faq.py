import re

with open('src/components/FAQ.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'text-[#0284C7] text-sm font-bold tracking-widest uppercase mb-3',
    'text-[#0ea5e9] text-sm font-bold tracking-widest uppercase mb-4'
)
content = content.replace(
    'text-3xl md:text-5xl font-extrabold text-[#0F172A] leading-tight',
    'text-4xl md:text-5xl font-extrabold text-[#0F172A] leading-tight tracking-tight'
)
content = content.replace(
    'className="bg-white border-2 border-gray-200 hover:border-[#0284C7] transition-colors duration-300"',
    'className="bg-white border border-gray-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-[#0ea5e9]/30 transition-all duration-300"'
)
content = content.replace(
    'className={`h-5 w-5 text-[#0284C7] transition-transform duration-300 flex-shrink-0 ${openIndex === index ? \'rotate-180\' : \'\'}`}',
    'className={`h-6 w-6 text-[#0ea5e9] transition-transform duration-300 flex-shrink-0 ${openIndex === index ? \'rotate-180\' : \'\'}`}'
)

with open('src/components/FAQ.tsx', 'w') as f:
    f.write(content)
