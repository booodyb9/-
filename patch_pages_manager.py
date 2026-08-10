import re

with open('src/pages/dashboard/PagesManager.tsx', 'r') as f:
    content = f.read()

# Add imports for upload
if 'import imageCompression' not in content:
    content = content.replace("import { v4 as uuidv4 } from 'uuid';",
                              "import { v4 as uuidv4 } from 'uuid';\nimport imageCompression from 'browser-image-compression';")

# Add upload function
upload_fn = """
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, isSeo = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: false };
      const compressedFile = await imageCompression(file, options);
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('media').upload(fileName, compressedFile);
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('media').getPublicUrl(fileName);
      
      const newImage = { name: file.name, url: data.publicUrl, storage_path: `media/${fileName}` };
      await supabase.from('media').insert([newImage]);
      
      if (isSeo) {
        setEditingPage({...editingPage, parsed: {...editingPage.parsed, seo: {...editingPage.parsed?.seo, [fieldName]: data.publicUrl}}});
      } else {
        setEditingPage({...editingPage, parsed: {...editingPage.parsed, [fieldName]: data.publicUrl}});
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert('فشل رفع الصورة');
    }
  };

  const handleSave = async () => {
"""
content = content.replace('  const handleSave = async () => {', upload_fn)

# Replace featuredImage input
featured_input = """              <input 
                 type="text" 
                 value={editingPage.parsed?.featuredImage || ''}
                onChange={e => setEditingPage({...editingPage, parsed: {...editingPage.parsed, featuredImage: e.target.value}})}
                className="w-full border p-2 rounded text-left mb-2" dir="ltr"
              />"""
featured_replacement = """              <div className="flex gap-2 mb-2">
                <input 
                   type="text" 
                   value={editingPage.parsed?.featuredImage || ''}
                  onChange={e => setEditingPage({...editingPage, parsed: {...editingPage.parsed, featuredImage: e.target.value}})}
                  className="flex-1 border p-2 rounded text-left" dir="ltr"
                />
                <label className="bg-gray-100 px-4 py-2 rounded cursor-pointer hover:bg-gray-200 border border-gray-300 font-bold flex items-center justify-center">
                  رفع صورة
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'featuredImage', false)} />
                </label>
              </div>"""
content = content.replace(featured_input, featured_replacement)

# Replace OG Image input
og_input = """<input type="text" value={editingPage.parsed?.seo?.ogImage || ''} onChange={e => setEditingPage({...editingPage, parsed: {...editingPage.parsed, seo: {...editingPage.parsed?.seo, ogImage: e.target.value}}})} className="w-full border p-2 rounded" />"""
og_replacement = """<div className="flex gap-2">
  <input type="text" value={editingPage.parsed?.seo?.ogImage || ''} onChange={e => setEditingPage({...editingPage, parsed: {...editingPage.parsed, seo: {...editingPage.parsed?.seo, ogImage: e.target.value}}})} className="flex-1 border p-2 rounded" />
  <label className="bg-gray-100 px-4 py-2 rounded cursor-pointer hover:bg-gray-200 border border-gray-300 font-bold flex items-center justify-center">
    رفع صورة
    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'ogImage', true)} />
  </label>
</div>"""
content = content.replace(og_input, og_replacement)

# Better success message for PagesManager
if 'const [successMessage, setSuccessMessage] = useState<string | null>(null);' not in content:
    content = content.replace('const [saving, setSaving] = useState(false);', 'const [saving, setSaving] = useState(false);\n  const [successMessage, setSuccessMessage] = useState<string | null>(null);')

save_target = """      alert('تم الحفظ بنجاح');
      fetchContents();
      setEditingKey(null);
      setEditingPage(null);
    } catch (error: any) {
"""
save_replacement = """      setSuccessMessage('تم حفظ الصفحة بنجاح');
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchContents();
      setEditingKey(null);
      setEditingPage(null);
    } catch (error: any) {
"""
content = content.replace(save_target, save_replacement)

render_target = """      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">إدارة الصفحات (CMS)</h2>
        <button onClick={handleAddNew} className="flex items-center gap-2 bg-[#0284C7] text-white px-4 py-2 rounded font-bold hover:bg-[#0369A1]">
          <Plus className="w-5 h-5" /> إنشـاء صفحة جديدة
        </button>
      </div>"""
render_replacement = """      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">إدارة الصفحات (CMS)</h2>
        <button onClick={handleAddNew} className="flex items-center gap-2 bg-[#0284C7] text-white px-4 py-2 rounded font-bold hover:bg-[#0369A1]">
          <Plus className="w-5 h-5" /> إنشـاء صفحة جديدة
        </button>
      </div>
      {successMessage && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6 font-bold border border-green-200">
          {successMessage}
        </div>
      )}"""
content = content.replace(render_target, render_replacement)

with open('src/pages/dashboard/PagesManager.tsx', 'w') as f:
    f.write(content)
print("PagesManager patched")
