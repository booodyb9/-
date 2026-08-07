with open('src/components/Blog.tsx', 'r') as f:
    content = f.read()

content = content.replace("if (Array.isArray(parsed) && parsed.length > 0) return parsed;", "if (Array.isArray(parsed) && parsed.length > 0) return [...parsed, ...defaultBlogPosts.slice(parsed.length)].slice(0, Math.max(parsed.length, 3));")

with open('src/components/Blog.tsx', 'w') as f:
    f.write(content)

with open('src/pages/public/BlogDetails.tsx', 'r') as f:
    content2 = f.read()

# Make it use defaultBlogPosts
if "const defaultBlogPosts" not in content2:
    default_posts_code = """
const defaultBlogPosts = [
  {
    category: 'دليل تقني',
    title: 'دليلك الشامل لاختيار الزجاج المناسب لكبائن الشاور',
    excerpt: 'تعرف على الفرق بين زجاج السيكوريت والزجاج العادي، وأهمية السماكة المناسبة لضمان الأمان والاناقة في حمامك.',
    date: '2024-05-15',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: '<p>اختيار الزجاج المناسب لكابينة الشاور يعتبر خطوة هامة في تصميم الحمام. الزجاج السيكوريت بسماكة 10 ملم أو 12 ملم هو الخيار الأمثل لقوته ومتانته.</p><p>يوفر الزجاج الشفاف إحساساً باتساع المكان، بينما يعتبر الزجاج المصنفر (المثلج) الخيار الأفضل للخصوصية.</p>'
  },
  {
    category: 'اتجاهات الصناعة',
    title: 'مستقبل الواجهات الزجاجية الذكية في المعمار الحديث',
    excerpt: 'كيف تساهم التقنيات الحديثة في صناعة زجاج يتحكم بالحرارة والضوء لتقليل استهلاك الطاقة في المباني الكبرى.',
    date: '2024-05-10',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: '<p>تتجه صناعة الزجاج المعماري نحو تقنيات الزجاج الذكي الذي يتغير لونه لتقليل حرارة الشمس الساطعة مما يخفض من استهلاك التكييف والطاقة.</p><p>نحن في زجاج الرياض نواكب أحدث تقنيات الزجاج المزدوج (Double Glass) العازل للحرارة والصوت.</p>'
  },
  {
    category: 'دراسة حالة',
    title: 'تحويل مساحة مكتبية مغلقة إلى بيئة عمل مفتوحة ومشرقة',
    excerpt: 'نستعرض كيف ساهمت قواطع الزجاج المزدوجة في تحسين الإضاءة الطبيعية والإنتاجية في مقر شركة تقنية بالرياض.',
    date: '2024-05-02',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: '<p>الضوء الطبيعي عامل أساسي لرفع إنتاجية الموظفين. باستخدام القواطع الزجاجية المزدوجة مع عزل صوتي عالي، تمكنا من توفير بيئة عمل مفتوحة تحافظ على الخصوصية عند الحاجة.</p>'
  }
];
"""
    content2 = content2.replace("export default function BlogDetails() {", default_posts_code + "\nexport default function BlogDetails() {")

content2 = content2.replace("""        const found = posts.find((p: any) => 
          p.title === decodeURIComponent(slug || '') || 
          p.title.replace(/\s+/g, '-').toLowerCase() === slug
        );
        setPost(found);""", """        const allPosts = [...posts, ...defaultBlogPosts];
        const found = allPosts.find((p: any) => 
          p.title === decodeURIComponent(slug || '') || 
          p.title.replace(/\s+/g, '-').toLowerCase() === slug
        );
        setPost(found);""")

with open('src/pages/public/BlogDetails.tsx', 'w') as f:
    f.write(content2)

print("Updated Blog.tsx and BlogDetails.tsx to handle default posts fallback smoothly")
