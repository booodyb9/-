content = open('src/components/SEO.tsx').read()
content = content.replace("export default function SEO({ title, description, keywords, image, structuredData }: SEOProps) {", "export default function SEO({ noindex, title, description, keywords, image, structuredData }: SEOProps) {")
open('src/components/SEO.tsx', 'w').write(content)
