import re

with open('src/components/Contact.tsx', 'r') as f:
    content = f.read()

# Update Section Background to premium dark
content = content.replace(
    'className="py-24 bg-[#111827] text-white relative overflow-hidden"',
    'className="py-24 bg-[#0F172A] text-white relative overflow-hidden"'
)

# Typography updates
content = content.replace(
    'text-[#0284C7] text-sm font-bold tracking-widest uppercase mb-3',
    'text-[#0ea5e9] text-sm font-bold tracking-widest uppercase mb-4'
)
content = content.replace(
    'text-3xl md:text-5xl font-extrabold mb-6',
    'text-4xl md:text-5xl font-extrabold mb-6 tracking-tight'
)

# Icons updates
content = content.replace(
    'w-12 h-12 bg-transparent/5 text-[#0284C7] rounded-sm',
    'w-14 h-14 bg-white/5 text-[#0ea5e9] rounded-2xl shadow-inner border border-white/10'
)

# Form Box Update
content = content.replace(
    'className="bg-transparent p-10 shadow-2xl text-gray-900 border border-gray-200"',
    'className="bg-white rounded-3xl p-10 sm:p-12 shadow-[0_20px_60px_rgb(0,0,0,0.3)] text-[#0F172A] border border-gray-100"'
)

# Inputs Update
content = content.replace(
    'focus:border-[#0284C7] transition-colors bg-[#F9FAFB] outline-none rounded-none',
    'focus:border-[#0ea5e9] focus:ring-4 focus:ring-[#0ea5e9]/10 transition-all bg-gray-50 outline-none rounded-xl'
)

# Send Button Update
content = content.replace(
    'className="w-full bg-[#0284C7] text-white p-4 font-bold hover:bg-[#0369A1] transition-colors mt-2"',
    'className="w-full bg-[#0F172A] text-white p-4 font-bold hover:bg-[#0ea5e9] rounded-xl transition-all duration-300 mt-2 shadow-lg hover:shadow-[#0ea5e9]/25 hover:-translate-y-1"'
)

with open('src/components/Contact.tsx', 'w') as f:
    f.write(content)
