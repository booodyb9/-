content = open('src/pages/dashboard/PagesManager.tsx').read()
warning_html = """
              <h3 className="font-bold mb-4 border-b pb-2">إعدادات SEO</h3>
              {(!editingPage.parsed?.seo?.title || !editingPage.parsed?.seo?.description) && (
                <div className="bg-yellow-50 text-yellow-800 p-3 rounded mb-4 text-sm font-bold flex gap-2 items-center">
                  ⚠️ تنبيه: يرجى إكمال إعدادات SEO (العنوان والوصف) لضمان أرشفة أفضل.
                </div>
              )}
"""
content = content.replace('<h3 className="font-bold mb-4 border-b pb-2">إعدادات SEO</h3>', warning_html)
open('src/pages/dashboard/PagesManager.tsx', 'w').write(content)
