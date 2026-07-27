import re

with open('src/pages/dashboard/PagesManager.tsx', 'r') as f:
    content = f.read()

delete_impl = """  const handleDelete = async (key: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصفحة؟')) return;
    try {
      const { supabase } = await import('../../lib/supabase');
      const { error } = await supabase.from('contents').delete().eq('key', key);
      if (error) throw error;
      fetchContents();
    } catch (error: any) {
      alert('خطأ: ' + error.message);
    }
  };"""

# Replace the existing handleDelete
content = re.sub(r'  const handleDelete = async \(key: string\) => \{.*?\n  \};\n', delete_impl + '\n', content, flags=re.DOTALL)

with open('src/pages/dashboard/PagesManager.tsx', 'w') as f:
    f.write(content)
