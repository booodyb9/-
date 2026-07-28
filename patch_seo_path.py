import re

with open('src/components/SEO.tsx', 'r') as f:
    content = f.read()

import_use_location = "import { useLocation } from 'react-router-dom';\n"
if "import { useLocation" not in content:
    content = content.replace("import { Helmet }", import_use_location + "import { Helmet }")

content = content.replace("export default function SEO({ title, description, keywords, image, path = '', structuredData }: SEOProps) {", 
                          "export default function SEO({ title, description, keywords, image, structuredData }: SEOProps) {")

content = content.replace("  const { getContent } = useContent();",
                          "  const { getContent } = useContent();\n  const location = useLocation();\n  const path = location.pathname;")

with open('src/components/SEO.tsx', 'w') as f:
    f.write(content)
