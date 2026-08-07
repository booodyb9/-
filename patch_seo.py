import re

content = open('src/components/SEO.tsx').read()
content = content.replace("interface SEOProps {", "interface SEOProps {\n  noindex?: boolean;")
content = content.replace("<link rel=\"alternate\" href={url} hrefLang=\"x-default\" />", "<link rel=\"alternate\" href={url} hrefLang=\"x-default\" />\n      {noindex && <meta name=\"robots\" content=\"noindex, follow\" />}")

open('src/components/SEO.tsx', 'w').write(content)
