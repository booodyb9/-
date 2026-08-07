with open('src/pages/dashboard/ContentManager.tsx', 'r') as f:
    content = f.read()

target = """      { key: 'excerpt', label: 'مقتطف (وصف قصير)', type: 'textarea' },
      { key: 'date', label: 'التاريخ', type: 'text' },"""

replacement = """      { key: 'excerpt', label: 'مقتطف (وصف قصير)', type: 'textarea' },
      { key: 'content', label: 'محتوى المقال', type: 'rich_text' },
      { key: 'date', label: 'التاريخ', type: 'text' },"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/pages/dashboard/ContentManager.tsx', 'w') as f:
        f.write(content)
    print("Blog schema patched")
else:
    print("Blog target not found")
