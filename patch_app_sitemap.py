import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

import_sitemap = "const SitemapPage = React.lazy(() => import('./pages/public/SitemapPage'));\n"
if "SitemapPage" not in content:
    content = content.replace("const DynamicPage", import_sitemap + "const DynamicPage")

route_sitemap = '<Route path="/sitemap" element={<SitemapPage />} />\n'
if "/sitemap" not in content:
    content = content.replace('<Route path="/privacy-policy"', route_sitemap + '                <Route path="/privacy-policy"')

with open('src/App.tsx', 'w') as f:
    f.write(content)
