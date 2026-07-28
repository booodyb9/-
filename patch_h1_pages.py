import os

pages = {
    'src/pages/public/ServicesPage.tsx': {
        'title': 'خدماتنا',
        'desc': 'اكتشف مجموعة واسعة من الخدمات التي نقدمها'
    },
    'src/pages/public/Portfolio.tsx': {
        'title': 'معرض الأعمال',
        'desc': 'تصفح أحدث مشاريعنا وأعمالنا السابقة'
    },
    'src/pages/public/FAQPage.tsx': {
        'title': 'الأسئلة الشائعة',
        'desc': 'إجابات وافية على كافة استفساراتكم'
    },
    'src/pages/public/TestimonialsPage.tsx': {
        'title': 'آراء العملاء',
        'desc': 'ماذا يقول عملاؤنا عن خدماتنا'
    },
    'src/pages/public/ContactPage.tsx': {
        'title': 'اتصل بنا',
        'desc': 'نحن هنا لخدمتك والرد على استفساراتك'
    },
    'src/pages/public/BlogPage.tsx': {
        'title': 'المدونة',
        'desc': 'أحدث المقالات والنصائح في عالم الزجاج'
    }
}

for filepath, info in pages.items():
    with open(filepath, 'r') as f:
        content = f.read()
    
    hero_html = f"""
      <div className="bg-[#0F172A] text-white pt-32 pb-16 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{info['title']}</h1>
          <p className="text-lg text-gray-300">{info['desc']}</p>
        </div>
      </div>
"""
    
    # We replace <main className="pt-20"> with <main> + hero_html
    content = content.replace('<main className="pt-20">', '<main>\n' + hero_html)
    content = content.replace('<main className="pt-20 min-h-screen">', '<main className="min-h-screen">\n' + hero_html)
    
    with open(filepath, 'w') as f:
        f.write(content)

