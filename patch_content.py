import re

with open('src/contexts/ContentContext.tsx', 'r') as f:
    content = f.read()

if 'updateContent' not in content:
    content = content.replace(
        "refreshContent: () => Promise<void>;",
        "refreshContent: () => Promise<void>;\n  updateContent: (key: string, body: string) => void;"
    )
    
    content = content.replace(
        "const getContent = (key: string) => contents.find(c => c.key === key);",
        "const getContent = (key: string) => contents.find(c => c.key === key);\n\n  const updateContent = (key: string, body: string) => {\n    setContents(prev => prev.map(c => c.key === key ? { ...c, body } : c));\n  };"
    )
    
    content = content.replace(
        "getContent, refreshContent: fetchContents",
        "getContent, refreshContent: fetchContents, updateContent"
    )

with open('src/contexts/ContentContext.tsx', 'w') as f:
    f.write(content)
