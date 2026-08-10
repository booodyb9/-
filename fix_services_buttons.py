import re

with open('src/components/Services.tsx', 'r') as f:
    content = f.read()

old_details_btn = 'className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-[#0F172A] px-4 py-3 text-sm font-semibold rounded-xl transition-colors group/btn"'
new_details_btn = 'className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-50/80 backdrop-blur-md border border-gray-200/50 hover:bg-gray-100 hover:border-gray-300 text-[#0F172A] px-5 py-3 text-sm font-bold rounded-full transition-all group/btn"'

old_wa_btn = 'className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white px-4 py-3 text-sm font-semibold rounded-xl transition-colors group/btn"'
new_wa_btn = 'className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#25D366]/20 to-[#128C7E]/20 backdrop-blur-md border border-[#25D366]/30 text-[#128C7E] hover:from-[#25D366] hover:to-[#128C7E] hover:text-white px-5 py-3 text-sm font-bold rounded-full transition-all group/btn shadow-[0_4px_15px_rgba(37,211,102,0.15)] hover:shadow-[0_8px_25px_rgba(37,211,102,0.3)]"'

content = content.replace(old_details_btn, new_details_btn)
content = content.replace(old_wa_btn, new_wa_btn)

with open('src/components/Services.tsx', 'w') as f:
    f.write(content)

print("Done replacing buttons in Services.tsx")
