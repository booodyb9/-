content = open('src/pages/dashboard/PagesManager.tsx').read()
fields = """
                <div>
                  <label className="block text-sm mb-1">Keywords</label>
                  <input type="text" value={editingPage.parsed?.seo?.keywords || ''} onChange={e => setEditingPage({...editingPage, parsed: {...editingPage.parsed, seo: {...editingPage.parsed?.seo, keywords: e.target.value}}})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Canonical URL</label>
                  <input type="text" value={editingPage.parsed?.seo?.canonical || ''} onChange={e => setEditingPage({...editingPage, parsed: {...editingPage.parsed, seo: {...editingPage.parsed?.seo, canonical: e.target.value}}})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm mb-1">OG Image</label>
                  <input type="text" value={editingPage.parsed?.seo?.ogImage || ''} onChange={e => setEditingPage({...editingPage, parsed: {...editingPage.parsed, seo: {...editingPage.parsed?.seo, ogImage: e.target.value}}})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer mt-4">
                    <input type="checkbox" checked={!!editingPage.parsed?.seo?.noindex} onChange={e => setEditingPage({...editingPage, parsed: {...editingPage.parsed, seo: {...editingPage.parsed?.seo, noindex: e.target.checked}}})} className="w-5 h-5 rounded border-gray-300" />
                    <span className="text-sm">منع الأرشفة (NoIndex)</span>
                  </label>
                </div>
"""
content = content.replace("onChange={e => setEditingPage({...editingPage, parsed: {...editingPage.parsed, seo: {...editingPage.parsed?.seo, description: e.target.value}}})}\n                    className=\"w-full border p-2 rounded h-24\"\n                  />\n                </div>", "onChange={e => setEditingPage({...editingPage, parsed: {...editingPage.parsed, seo: {...editingPage.parsed?.seo, description: e.target.value}}})}\n                    className=\"w-full border p-2 rounded h-24\"\n                  />\n                </div>\n" + fields)
open('src/pages/dashboard/PagesManager.tsx', 'w').write(content)
