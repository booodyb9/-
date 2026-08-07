with open('src/pages/public/ServiceDetails.tsx', 'r') as f:
    content = f.read()

# Replace the current blue WhatsApp button with the SectionCTA style ones.
if "import SectionCTA" not in content:
    content = content.replace("import Footer from '../../components/Footer';", "import Footer from '../../components/Footer';\nimport SectionCTA from '../../components/SectionCTA';")

# In the buttons div:
old_buttons = """            <div className="mt-12 flex gap-4">
              <a href="https://wa.me/966510233706" className="bg-[#0284C7] text-white px-8 py-3 rounded-md hover:bg-[#0369A1] transition-colors font-bold text-center inline-block">
                طلب تسعيرة لهذه الخدمة
              </a>
              <Link to="/services" className="bg-gray-100 text-gray-800 px-8 py-3 rounded-md hover:bg-gray-200 transition-colors font-bold text-center inline-block">
                العودة للخدمات
              </Link>
            </div>"""

new_buttons = """            <div className="mt-12">
              <SectionCTA />
              <div className="mt-8 text-center">
                <Link to="/services" className="bg-gray-100 text-gray-800 px-8 py-3 rounded-md hover:bg-gray-200 transition-colors font-bold inline-block">
                  العودة للخدمات
                </Link>
              </div>
            </div>"""

content = content.replace(old_buttons, new_buttons)

with open('src/pages/public/ServiceDetails.tsx', 'w') as f:
    f.write(content)
