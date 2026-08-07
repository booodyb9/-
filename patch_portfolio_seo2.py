content = open('src/pages/dashboard/PortfolioManager.tsx').read()
fields = """
              <div>
                <label className="block text-sm font-medium mb-1">SEO Keywords</label>
                <input type="text" value={currentProject.seoKeywords || ''} onChange={e => setCurrentProject({ ...currentProject, seoKeywords: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">SEO Canonical URL</label>
                <input type="text" value={currentProject.seoCanonical || ''} onChange={e => setCurrentProject({ ...currentProject, seoCanonical: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">SEO OG Image</label>
                <input type="text" value={currentProject.seoImage || ''} onChange={e => setCurrentProject({ ...currentProject, seoImage: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer mt-6">
                  <input type="checkbox" checked={!!currentProject.seoNoIndex} onChange={e => setCurrentProject({ ...currentProject, seoNoIndex: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-[#0284C7] focus:ring-[#0284C7]" />
                  <span className="text-gray-700 font-bold">منع الأرشفة (NoIndex)</span>
                </label>
              </div>
"""

content = content.replace('onChange={e => setCurrentProject({ ...currentProject, seoDescription: e.target.value })}\n                  className="w-full border p-2 rounded h-20"\n                />\n              </div>', 'onChange={e => setCurrentProject({ ...currentProject, seoDescription: e.target.value })}\n                  className="w-full border p-2 rounded h-20"\n                />\n              </div>\n' + fields)

warning_html = """
            <h3 className="font-bold mb-2">تحسين محركات البحث (SEO)</h3>
            {(!currentProject.seoTitle || !currentProject.seoDescription) && (
              <div className="bg-yellow-50 text-yellow-800 p-3 rounded mb-4 text-sm font-bold flex gap-2 items-center">
                ⚠️ تنبيه: يرجى إكمال إعدادات SEO (العنوان والوصف) لضمان أرشفة أفضل.
              </div>
            )}
"""
content = content.replace('<h3 className="font-bold mb-2">تحسين محركات البحث (SEO)</h3>', warning_html)

open('src/pages/dashboard/PortfolioManager.tsx', 'w').write(content)
