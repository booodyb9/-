import re

with open('src/pages/dashboard/MediaLibrary.tsx', 'r') as f:
    content = f.read()

delete_impl = """  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    try {
      const fileToDelete = mediaFiles.find(m => m.id === id);
      if (fileToDelete) {
        if (fileToDelete.storage_path) {
           const path = fileToDelete.storage_path.replace('media/', '');
           await supabase.storage.from('media').remove([path]);
        } else if (fileToDelete.url) {
           const urlParts = fileToDelete.url.split('/');
           const fileName = urlParts[urlParts.length - 1];
           await supabase.storage.from('media').remove([fileName]);
        }
      }
      const { error } = await supabase.from('media').delete().eq('id', id);
      if (error) throw error;
      fetchMedia();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };"""

content = re.sub(r'  const handleDelete = async \(id: string \| number\) => \{.*?\n  \};\n', delete_impl + '\n', content, flags=re.DOTALL)

with open('src/pages/dashboard/MediaLibrary.tsx', 'w') as f:
    f.write(content)
