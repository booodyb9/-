import re

with open('src/components/Footer.tsx', 'r') as f:
    content = f.read()

import_link = "import { Link } from 'react-router-dom';\n"
if "import { Link" not in content:
    content = content.replace("import { Facebook", import_link + "import { Facebook")

sitemap_link = '            <Link to="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors mt-2 md:mt-0 md:ml-6">خريطة الموقع</Link>'
if "خريطة الموقع" not in content:
    content = content.replace('<div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">',
                              '<div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">\n' + sitemap_link)

with open('src/components/Footer.tsx', 'w') as f:
    f.write(content)
