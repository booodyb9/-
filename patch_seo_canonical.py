content = open('src/components/SEO.tsx').read()
content = content.replace("  keywords?: string;\n  image?: string;", "  keywords?: string;\n  canonical?: string;\n  image?: string;")
content = content.replace("export default function SEO({ noindex, title, description, keywords, image, structuredData }: SEOProps) {", "export default function SEO({ noindex, title, description, keywords, canonical, image, structuredData }: SEOProps) {")

canonical_link = "      <link rel=\"canonical\" href={url} />"
new_canonical_link = "      <link rel=\"canonical\" href={canonical || url} />"
content = content.replace(canonical_link, new_canonical_link)

open('src/components/SEO.tsx', 'w').write(content)
