from pathlib import Path

# PagesManager: use the shared device upload component for featured image.
p = Path('src/pages/dashboard/PagesManager.tsx')
s = p.read_text()
if "import ImageUploadField from './ImageUploadField';" not in s:
    s = s.replace("import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';", "import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';\nimport ImageUploadField from './ImageUploadField';")
old = '''              <label className="block text-sm font-bold mb-2">الصورة البارزة (رابط)</label>\n              <input \n                type="text" \n                value={editingPage.parsed?.featuredImage || ''}\n                onChange={e => setEditingPage({...editingPage, parsed: {...editingPage.parsed, featuredImage: e.target.value}})}\n                className="w-full border p-2 rounded text-left mb-2" dir="ltr"\n              />\n              {editingPage.parsed?.featuredImage && (\n                <img loading="lazy" decoding="async" src={editingPage.parsed?.featuredImage} alt="Preview" className="w-full h-32 object-cover rounded" />\n              )}'''
new = '''              <ImageUploadField\n                label="الصورة البارزة"\n                value={editingPage.parsed?.featuredImage || ''}\n                folder="pages/featured"\n                onChange={(featuredImage) => setEditingPage({...editingPage, parsed: {...editingPage.parsed, featuredImage}})}\n              />'''
if old not in s:
    raise SystemExit('PagesManager featured image block not found')
s = s.replace(old, new, 1)
p.write_text(s)

# SiteSettings: logo + favicon from device.
p = Path('src/pages/dashboard/SiteSettings.tsx')
s = p.read_text()
if "import ImageUploadField from './ImageUploadField';" not in s:
    s = s.replace("import { useContent } from '../../contexts/ContentContext';", "import { useContent } from '../../contexts/ContentContext';\nimport ImageUploadField from './ImageUploadField';")
s = s.replace('''          <Field label="الشعار الرئيسي" value={settings.logoUrl} onChange={(value) => handleChange('logoUrl', value)} dir="ltr" />\n          <Field label="Favicon" value={settings.faviconUrl} onChange={(value) => handleChange('faviconUrl', value)} dir="ltr" />''', '''          <ImageUploadField label="الشعار الرئيسي" value={settings.logoUrl} folder="site/branding" onChange={(value) => handleChange('logoUrl', value)} />\n          <ImageUploadField label="Favicon" value={settings.faviconUrl} folder="site/branding" onChange={(value) => handleChange('faviconUrl', value)} helpText="يفضل صورة مربعة PNG أو WEBP." />''', 1)
p.write_text(s)

# Home: defer heavy below-the-fold modules. AnimatedRoutes already provides an outer Suspense,
# but local boundaries keep the visible page rendered while these chunks arrive.
p = Path('src/pages/public/Home.tsx')
s = p.read_text()
s = s.replace("import GallerySlider from '../../components/GallerySlider';\nimport Blog from '../../components/Blog';", "const GallerySlider = React.lazy(() => import('../../components/GallerySlider'));\nconst Blog = React.lazy(() => import('../../components/Blog'));")
s = s.replace('      <GallerySlider />', '      <React.Suspense fallback={<div className="min-h-40" aria-hidden="true" />}><GallerySlider /></React.Suspense>', 1)
s = s.replace('      <Blog />', '      <React.Suspense fallback={<div className="min-h-40" aria-hidden="true" />}><Blog /></React.Suspense>', 1)
p.write_text(s)

# SEO crawl configuration: use current production host and keep admin out of search.
base = 'https://glass-securite-alriyad.netlify.app'
Path('public/robots.txt').write_text(f'''User-agent: *\nAllow: /\nDisallow: /dashboard/\nSitemap: {base}/sitemap.xml\n''')

routes = [
    ('/', 'daily', '1.0'),
    ('/about', 'weekly', '0.8'),
    ('/services', 'weekly', '0.9'),
    ('/portfolio', 'weekly', '0.9'),
    ('/blog', 'weekly', '0.8'),
    ('/faq', 'monthly', '0.7'),
    ('/testimonials', 'monthly', '0.7'),
    ('/contact', 'monthly', '0.8'),
    ('/request-quote', 'monthly', '0.9'),
    ('/privacy-policy', 'yearly', '0.3'),
    ('/terms', 'yearly', '0.3'),
]
xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for route, freq, priority in routes:
    url = base + ('' if route == '/' else route)
    xml += ['  <url>', f'    <loc>{url}</loc>', f'    <changefreq>{freq}</changefreq>', f'    <priority>{priority}</priority>', '  </url>']
xml.append('</urlset>')
Path('public/sitemap.xml').write_text('\n'.join(xml) + '\n')

# Static shell SEO for crawlers/social bots before React hydration.
p = Path('index.html')
s = p.read_text()
if '<link rel="canonical"' not in s:
    s = s.replace('    <meta name="robots" content="index, follow" />', f'    <meta name="robots" content="index, follow" />\n    <link rel="canonical" href="{base}/" />\n    <meta property="og:url" content="{base}/" />')
p.write_text(s)
