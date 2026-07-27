import re

with open('src/pages/public/DynamicPage.tsx', 'r') as f:
    content = f.read()

replacement = """        for (const p of pages) {
            try {
              const data = JSON.parse(p.body);
              if (data.slug === slug) {
                  // If it's a draft, only admins can see it
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
        }"""

content = re.sub(r'        for \(const p of pages\) \{.*?        \}', replacement, content, flags=re.DOTALL)

with open('src/pages/public/DynamicPage.tsx', 'w') as f:
    f.write(content)
