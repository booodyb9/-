import re

with open('src/components/ProjectStats.tsx', 'r') as f:
    content = f.read()

content = content.replace('bg-white/80 backdrop-blur-md rounded-2xl p-6 text-center border border-gray-100 hover:border-[#0284C7]/30 transition-colors shadow-sm', 'bg-white rounded-3xl p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-gray-100 transition-all duration-500 hover:-translate-y-1')
content = content.replace('bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100', 'bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100')

with open('src/components/ProjectStats.tsx', 'w') as f:
    f.write(content)
