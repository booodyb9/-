from pathlib import Path

# PagesManager OG image -> shared device uploader.
p = Path('src/pages/dashboard/PagesManager.tsx')
s = p.read_text()
old = '''                <div>\n                  <label className="block text-sm mb-1">OG Image</label>\n                  <div className="flex gap-2">\n  <input type="text" value={editingPage.parsed?.seo?.ogImage || ''} onChange={e => setEditingPage({...editingPage, parsed: {...editingPage.parsed, seo: {...editingPage.parsed?.seo, ogImage: e.target.value}}})} className="flex-1 border p-2 rounded" />\n  <label className="bg-gray-100 px-4 py-2 rounded cursor-pointer hover:bg-gray-200 border border-gray-300 font-bold flex items-center justify-center">\n    رفع صورة\n    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'ogImage', true)} />\n  </label>\n</div>\n                </div>'''
new = '''                <ImageUploadField\n                  label="OG Image"\n                  value={editingPage.parsed?.seo?.ogImage || ''}\n                  folder="pages/seo"\n                  onChange={(ogImage) => setEditingPage({...editingPage, parsed: {...editingPage.parsed, seo: {...editingPage.parsed?.seo, ogImage}}})}\n                />'''
if old not in s:
    raise SystemExit('PagesManager OG image block not found')
s = s.replace(old, new, 1)
p.write_text(s)

# Portfolio OG image -> shared device uploader; fix icon imports.
p = Path('src/pages/dashboard/PortfolioManager.tsx')
s = p.read_text()
s = s.replace("import { Plus, Edit2, Trash2, Eye, EyeOff, Star, Copy, Image as ImageIcon, Save, X, GripVertical } from 'lucide-react';", "import { Plus, Edit2, Trash2, Eye, EyeOff, Star, Copy, Image as ImageIcon, Save, X, GripVertical, Sparkles, Loader2 } from 'lucide-react';")
old = '''              <div>\n                <label className="block text-sm font-medium mb-1">SEO OG Image</label>\n                <input type="text" value={currentProject.seoImage || ''} onChange={e => setCurrentProject({ ...currentProject, seoImage: e.target.value })} className="w-full border p-2 rounded" />\n              </div>'''
new = '''              <ImageUploadField\n                label="SEO OG Image"\n                value={currentProject.seoImage || ''}\n                folder="portfolio/seo"\n                onChange={(seoImage) => setCurrentProject({ ...currentProject, seoImage })}\n              />'''
if old not in s:
    raise SystemExit('Portfolio SEO image block not found')
s = s.replace(old, new, 1)
p.write_text(s)

# main.tsx: remove global icon workaround now that Portfolio imports icons correctly.
p = Path('src/main.tsx')
s = p.read_text()
s = s.replace("import { Loader2 as Loader2Icon, Sparkles as SparklesIcon } from 'lucide-react';\n", '')
s = s.replace("// PortfolioManager is legacy-generated code that references these two icon bindings\n// without importing them. Expose stable bindings until that module is fully refactored.\nObject.assign(globalThis, { Loader2: Loader2Icon, Sparkles: SparklesIcon });\n", '')
p.write_text(s)
