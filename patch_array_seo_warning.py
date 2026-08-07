content = open('src/pages/dashboard/ArrayEditor.tsx').read()
warning_html = """
          <div className="absolute top-4 left-4 flex gap-2">
"""
# insert before
warning_check = """
          {schema.some(f => f.key === 'seoTitle') && (!item.seoTitle || !item.seoDescription) && (
            <div className="bg-yellow-50 text-yellow-800 p-2 rounded mb-4 text-xs font-bold flex gap-2 items-center">
              ⚠️ تنبيه: يرجى إكمال إعدادات SEO (العنوان والوصف) في هذا العنصر لضمان أرشفة أفضل.
            </div>
          )}
"""
content = content.replace('<h4 className="font-bold text-gray-700 mb-4">عنصر #{index + 1}</h4>', '<h4 className="font-bold text-gray-700 mb-4">عنصر #{index + 1}</h4>\n' + warning_check)
open('src/pages/dashboard/ArrayEditor.tsx', 'w').write(content)
