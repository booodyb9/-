import re

with open('src/pages/public/DynamicPage.tsx', 'r') as f:
    content = f.read()

effect = """  useEffect(() => {
    if (loading) return;
    
    const pages = contents.filter(c => c.key.startsWith('page_') && c.type === 'page');
    for (const p of pages) {
      if (!p.body) continue;
      try {
        const data = JSON.parse(p.body);
        if (data.slug === slug) {
          if (data.status === 'draft' && !isAdmin) {
             setPageData('not_found');
             return;
          }
          setPageData(data);
          return;
        }
      } catch (err) {
        console.error("Error parsing page JSON", err);
      }
    }
    
    setPageData('not_found');
  }, [slug, contents, loading, isAdmin]);"""

content = re.sub(r'  useEffect\(\(\) => \{.*?  \}, \[slug, contents, loading, isAdmin\]\);', effect, content, flags=re.DOTALL)

with open('src/pages/public/DynamicPage.tsx', 'w') as f:
    f.write(content)
