import re

# Patch Process.tsx
with open('src/components/Process.tsx', 'r') as f:
    process_content = f.read()

process_content = process_content.replace(
    'text-[#0284C7] text-sm font-bold tracking-widest uppercase mb-3',
    'text-[#0ea5e9] text-sm font-bold tracking-widest uppercase mb-4'
)
process_content = process_content.replace(
    'text-3xl md:text-5xl font-extrabold text-[#0F172A] leading-tight',
    'text-4xl md:text-5xl font-extrabold text-[#0F172A] leading-tight tracking-tight'
)
process_content = process_content.replace(
    'w-20 h-20 bg-white border-4 border-gray-50 rounded-full flex items-center justify-center text-[#0284C7] shadow-sm mb-6 relative',
    'w-24 h-24 bg-white border border-gray-100 rounded-full flex items-center justify-center text-[#0ea5e9] shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 relative group-hover:scale-110 transition-transform duration-500'
)
process_content = process_content.replace(
    'className="flex flex-col items-center text-center"',
    'className="flex flex-col items-center text-center group"'
)

with open('src/components/Process.tsx', 'w') as f:
    f.write(process_content)

# Patch TrustedPartners.tsx
with open('src/components/TrustedPartners.tsx', 'r') as f:
    partners_content = f.read()

partners_content = partners_content.replace(
    'text-[#0284C7] text-sm font-bold tracking-widest uppercase mb-2',
    'text-[#0ea5e9] text-sm font-bold tracking-widest uppercase mb-4'
)
partners_content = partners_content.replace(
    'text-2xl font-bold text-gray-900',
    'text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight'
)
partners_content = partners_content.replace(
    'w-48 h-24 bg-white/80 backdrop-blur-md rounded-lg shadow-sm flex items-center justify-center p-4 filter grayscale hover:grayscale-0 transition-all duration-300 border border-gray-100',
    'w-48 h-24 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] flex items-center justify-center p-4 filter grayscale hover:grayscale-0 transition-all duration-500 border border-gray-100 hover:-translate-y-1'
)
partners_content = partners_content.replace(
    'className="py-16 bg-transparent border-y border-gray-200 overflow-hidden"',
    'className="py-20 bg-gray-50 border-y border-gray-100 overflow-hidden"'
)

with open('src/components/TrustedPartners.tsx', 'w') as f:
    f.write(partners_content)
