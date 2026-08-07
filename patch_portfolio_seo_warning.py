content = open('src/pages/dashboard/PortfolioManager.tsx').read()
warning_html = """
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-bold border-b pb-2">SEO Settings</h3>
              {(!currentProject.seoTitle || !currentProject.seoDescription) && (
                <div className="bg-yellow-50 text-yellow-800 p-3 rounded mb-4 text-sm font-bold flex gap-2 items-center">
                  ⚠️ تنبيه: يرجى إكمال إعدادات SEO (العنوان والوصف) لضمان أرشفة أفضل.
                </div>
              )}
"""
content = content.replace('<div className="bg-gray-50 p-4 rounded-lg space-y-4">\n              <h3 className="font-bold border-b pb-2">SEO Settings</h3>', warning_html)
open('src/pages/dashboard/PortfolioManager.tsx', 'w').write(content)
