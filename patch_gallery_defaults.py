import re

with open('src/components/Gallery.tsx', 'r') as f:
    content = f.read()

default_projects_code = """
const defaultProjects: PortfolioProject[] = [
  {
    id: '1',
    title: 'واجهات برج المكاتب',
    category: 'واجهات زجاجية',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'تركيب واجهة كرتن وول للمبنى بالكامل مع زجاج مزدوج عازل للحرارة والصوت.',
    isFeatured: true,
    isHidden: false,
    order: 1
  },
  {
    id: '2',
    title: 'قواطع شركة التقنية',
    category: 'قواطع مكتبية',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'تنفيذ قواطع زجاجية ذكية عازلة للصوت لمكاتب الإدارة وقاعات الاجتماعات.',
    isFeatured: true,
    isHidden: false,
    order: 2
  },
  {
    id: '3',
    title: 'فيلا حي النرجس',
    category: 'درابزين وسلالم',
    coverImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'تصميم وتركيب درابزين زجاجي سيكوريت 12 ملم للسلالم الداخلية والشرفات.',
    isFeatured: true,
    isHidden: false,
    order: 3
  },
  {
    id: '4',
    title: 'شاور كابين الفاخر',
    category: 'كبائن شاور',
    coverImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'كابينة شاور زجاجية بتصميم عصري وإكسسوارات مقاومة للصدأ.',
    isFeatured: true,
    isHidden: false,
    order: 4
  },
  {
    id: '5',
    title: 'مرايا النادي الرياضي',
    category: 'مرايا ديكورية',
    coverImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'تغطية جدران النادي بالكامل بمرايا كريستال عالية الجودة مع إضاءة ليد.',
    isFeatured: false,
    isHidden: false,
    order: 5
  },
  {
    id: '6',
    title: 'أبواب المعرض التجاري',
    category: 'أبواب سيكوريت',
    coverImage: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'أبواب زجاجية سحاب أوتوماتيكية لمعرض تجاري بآلية فتح وإغلاق سلسة.',
    isFeatured: true,
    isHidden: false,
    order: 6
  }
];
"""

# Insert default projects before the Gallery function
content = content.replace("export default function Gallery", default_projects_code + "\nexport default function Gallery")

# Replace useEffect with one that uses defaultProjects fallback
old_use_effect = """  useEffect(() => {
    if (portfolioContent?.body) {
      try {
        const parsed = JSON.parse(portfolioContent.body);
        if (Array.isArray(parsed)) {
          let validProjects = parsed.filter(p => !p.isHidden);
          validProjects.sort((a, b) => (a.order || 0) - (b.order || 0));
          
          if (featuredOnly) {
            validProjects = validProjects.filter(p => p.isFeatured);
          }
          setTotalProjects(validProjects.length);
          
          if (limit) {
            validProjects = validProjects.slice(0, limit);
          }
          setProjects(validProjects);
        }
      } catch (e) {
        console.error("Failed to parse portfolio projects", e);
      }
    }
  }, [portfolioContent, limit, featuredOnly]);"""

new_use_effect = """  useEffect(() => {
    let baseProjects = defaultProjects;
    
    if (portfolioContent?.body) {
      try {
        const parsed = JSON.parse(portfolioContent.body);
        if (Array.isArray(parsed) && parsed.length > 0) {
          baseProjects = parsed;
        }
      } catch (e) {
        console.error("Failed to parse portfolio projects", e);
      }
    }
    
    let validProjects = baseProjects.filter(p => !p.isHidden);
    validProjects.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    if (featuredOnly) {
      validProjects = validProjects.filter(p => p.isFeatured !== false); // Ensure featured shows if not explicitly false
    }
    setTotalProjects(validProjects.length);
    
    if (limit) {
      validProjects = validProjects.slice(0, limit);
    }
    setProjects(validProjects);
  }, [portfolioContent, limit, featuredOnly]);"""

content = content.replace(old_use_effect, new_use_effect)

with open('src/components/Gallery.tsx', 'w') as f:
    f.write(content)
