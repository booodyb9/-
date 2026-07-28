import re
import glob

for filename in glob.glob('src/pages/public/*.tsx'):
    with open(filename, 'r') as f:
        content = f.read()
        
    content = content.replace('<h1 className="text-2xl font-bold text-gray-600 mb-4">جاري التحميل...</h1>', '<div className="text-2xl font-bold text-gray-600 mb-4">جاري التحميل...</div>')
    content = content.replace('<h1 className="text-3xl font-bold mb-4">جاري التحميل أو المقال غير موجود</h1>', '<div className="text-3xl font-bold mb-4">جاري التحميل أو المقال غير موجود</div>')
    content = content.replace('<h1 className="text-3xl font-bold mb-4">جاري التحميل أو الخدمة غير موجودة</h1>', '<div className="text-3xl font-bold mb-4">جاري التحميل أو الخدمة غير موجودة</div>')
    content = content.replace('<h1 className="text-9xl font-bold text-[#0284C7] mb-4">404</h1>', '<div className="text-9xl font-bold text-[#0284C7] mb-4">404</div>')
    
    with open(filename, 'w') as f:
        f.write(content)
