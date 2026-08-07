import re

with open('src/components/Hero.tsx', 'r') as f:
    content = f.read()

# Make sure Phone is imported
if "Phone" not in content:
    content = content.replace("ArrowLeft } from 'lucide-react';", "ArrowLeft, Phone } from 'lucide-react';")

new_buttons = """
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row flex-wrap gap-4 mt-8">
              <a
                href="#services"
                className="group relative flex items-center justify-center gap-3 bg-white text-black px-8 py-4 font-bold text-base overflow-hidden rounded-md hover:text-white transition-colors duration-300"
              >
                <div className="absolute inset-0 bg-black translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                <span className="relative z-10">{language === 'ar' ? 'استكشف خدماتنا' : 'Explore Services'}</span>
                {language === 'ar' ? <ArrowLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform" /> : <ArrowUpRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />}
              </a>
              <a
                href={`https://wa.me/966510233706`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-4 font-bold text-base rounded-md hover:bg-[#1DA851] transition-colors duration-300 shadow-lg shadow-[#25D366]/20"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {language === 'ar' ? 'واتساب' : 'WhatsApp'}
              </a>
              <a
                href={`tel:+966510233706`}
                className="group flex items-center justify-center gap-2 bg-[#0284C7] text-white px-8 py-4 font-bold text-base rounded-md hover:bg-[#0369A1] transition-colors duration-300 shadow-lg shadow-[#0284C7]/20"
              >
                <Phone className="w-5 h-5" />
                {language === 'ar' ? 'اتصال' : 'Call'}
              </a>
            </motion.div>
"""

old_buttons_regex = re.compile(r'<motion\.div variants=\{itemVariants\} className="flex flex-col sm:flex-row gap-5">.*?</motion\.div>', re.DOTALL)
content = old_buttons_regex.sub(new_buttons, content)

with open('src/components/Hero.tsx', 'w') as f:
    f.write(content)

print("Hero.tsx buttons updated")
