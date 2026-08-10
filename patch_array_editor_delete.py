with open('src/pages/dashboard/ArrayEditor.tsx', 'r') as f:
    content = f.read()

target = """  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    notifyChange(newItems);
  };"""

replacement = """  const removeItem = (index: number) => {
    if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
      const newItems = [...items];
      newItems.splice(index, 1);
      notifyChange(newItems);
    }
  };"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/pages/dashboard/ArrayEditor.tsx', 'w') as f:
        f.write(content)
    print("ArrayEditor delete patched")
else:
    print("Target not found")
