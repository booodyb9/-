import re

with open('src/pages/public/ContactPage.tsx', 'r') as f:
    content = f.read()

schema_code = """      <SEO 
        title="اتصل بنا | شركة زجاج الرياض" 
        description="تواصل معنا للاستفسار وطلب الخدمات."
        structuredData={{
          "@type": "ContactPage",
          "name": "اتصل بنا",
          "description": "تواصل معنا للاستفسار وطلب الخدمات.",
          "mainEntity": {
            "@type": "ContactPoint",
            "telephone": "+966510233706",
            "contactType": "customer service",
            "availableLanguage": ["Arabic", "English"]
          }
        }}
      />"""

content = re.sub(r'<SEO\s+title="اتصل بنا\s*\|\s*شركة زجاج الرياض"\s*description="تواصل معنا للاستفسار وطلب الخدمات\."\s*/>', schema_code, content, flags=re.DOTALL)

with open('src/pages/public/ContactPage.tsx', 'w') as f:
    f.write(content)
