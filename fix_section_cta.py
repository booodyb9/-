import re

with open('src/components/SectionCTA.tsx', 'r') as f:
    content = f.read()

# WhatsApp button
old_wa = 'className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-4 font-bold text-base rounded-md hover:bg-[#1DA851] transition-colors duration-300 shadow-lg shadow-[#25D366]/20"'
new_wa = 'className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#25D366]/90 to-[#128C7E]/90 backdrop-blur-md border border-white/20 text-white px-8 py-4 font-bold text-base rounded-full hover:from-[#25D366] hover:to-[#128C7E] transition-all duration-300 shadow-[0_8px_30px_rgba(37,211,102,0.3)] hover:shadow-[0_12px_40px_rgba(37,211,102,0.5)] transform hover:-translate-y-1"'

# Call button
old_call = 'className="flex items-center justify-center gap-2 bg-[#0284C7] text-white px-8 py-4 font-bold text-base rounded-md hover:bg-[#0369A1] transition-colors duration-300 shadow-lg shadow-[#0284C7]/20"'
new_call = 'className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#0284C7]/90 to-[#0369A1]/90 backdrop-blur-md border border-white/20 text-white px-8 py-4 font-bold text-base rounded-full hover:from-[#0284C7] hover:to-[#0369A1] transition-all duration-300 shadow-[0_8px_30px_rgba(2,132,199,0.3)] hover:shadow-[0_12px_40px_rgba(2,132,199,0.5)] transform hover:-translate-y-1"'

content = content.replace(old_wa, new_wa)
content = content.replace(old_call, new_call)

with open('src/components/SectionCTA.tsx', 'w') as f:
    f.write(content)

print("Updated SectionCTA buttons")
