import re

with open('src/components/CostCalculator.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className="mt-20 bg-white border border-gray-200 shadow-xl overflow-hidden max-w-4xl mx-auto"',
    'className="mt-20 bg-white border border-gray-100 rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.08)] overflow-hidden max-w-4xl mx-auto"'
)
content = content.replace(
    'w-12 h-12 bg-[#0284C7]/20 text-[#0284C7] flex items-center justify-center mb-6 rounded-sm',
    'w-14 h-14 bg-white/10 text-[#0ea5e9] flex items-center justify-center mb-6 rounded-2xl shadow-inner border border-white/5'
)
content = content.replace(
    'text-3xl font-extrabold text-[#0284C7]',
    'text-4xl font-extrabold text-[#0ea5e9]'
)
content = content.replace(
    'className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 text-gray-900 p-3 focus:outline-none focus:border-[#0284C7] transition-colors"',
    'className="w-full flex items-center justify-between bg-gray-50 rounded-xl border border-gray-200 text-gray-900 p-3 focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all"'
)
content = content.replace(
    'className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3 pl-10 focus:outline-none focus:border-[#0284C7] transition-colors"',
    'className="w-full bg-gray-50 rounded-xl border border-gray-200 text-gray-900 p-3 pl-10 focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all"'
)
content = content.replace(
    'className="w-full flex items-center justify-center gap-2 bg-[#0284C7] text-white p-4 font-bold hover:bg-[#0369A1] transition-colors group"',
    'className="w-full flex items-center justify-center gap-2 bg-[#0F172A] text-white p-4 font-bold rounded-xl hover:bg-[#0ea5e9] transition-all duration-300 group shadow-lg hover:shadow-[#0ea5e9]/20"'
)
content = content.replace(
    'className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-xl max-h-60 overflow-y-auto z-30"',
    'className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-100 shadow-xl max-h-60 overflow-y-auto z-30"'
)
content = content.replace(
    'text-[#0284C7]',
    'text-[#0ea5e9]'
)

with open('src/components/CostCalculator.tsx', 'w') as f:
    f.write(content)
