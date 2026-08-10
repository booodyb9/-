import re

with open('src/pages/dashboard/PortfolioManager.tsx', 'r') as f:
    content = f.read()

if 'import imageCompression' not in content:
    content = content.replace("import { saveContent } from '../../lib/supabase';",
                              "import { saveContent, supabase } from '../../lib/supabase';\nimport imageCompression from 'browser-image-compression';")

# Add handleImageUpload to PortfolioManager
upload_fn = """
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof PortfolioProject) => {
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
      
      setCurrentProject({ ...currentProject, [fieldName]: data.publicUrl });
    } catch (error) {
      console.error("Upload error:", error);
      alert('فشل رفع الصورة');
    }
  };

  const handleSave = async () => {
"""
content = content.replace('  const handleSave = async () => {', upload_fn)

def replace_input(label_text, field_name):
    # Matches the whole input div for cover image
    pattern = r'<label[^>]*>' + label_text + r'<\/label>\s*<input[^>]*value=\{currentProject\.' + field_name + r' \|\| \'\'\}[^>]*>'
    match = re.search(pattern, content)
    if match:
        original = match.group(0)
        replacement = f"""<label className="block text-sm font-bold mb-2">{label_text}</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={{currentProject.{field_name} || ''}}
                  onChange={{e => setCurrentProject({{{'...currentProject'}, {field_name}: e.target.value}})}}
                  className="flex-1 w-full border border-gray-300 rounded-md p-2 focus:ring-[#0284C7] focus:border-[#0284C7]" 
                  dir="ltr"
                />
                <label className="bg-gray-100 px-4 py-2 rounded cursor-pointer hover:bg-gray-200 border border-gray-300 font-bold flex items-center justify-center whitespace-nowrap">
                  رفع صورة
                  <input type="file" className="hidden" accept="image/*" onChange={{(e) => handleImageUpload(e, '{field_name}')}} />
                </label>
              </div>"""
        return content.replace(original, replacement)
    return content

content = replace_input('صورة الغلاف (Cover Image URL)', 'coverImage')
content = replace_input('صورة قبل (Before Image URL)', 'beforeImage')
content = replace_input('صورة بعد (After Image URL)', 'afterImage')

# Add success message
if 'const [successMessage, setSuccessMessage] = useState<string | null>(null);' not in content:
    content = content.replace('const [saving, setSaving] = useState(false);', 'const [saving, setSaving] = useState(false);\n  const [successMessage, setSuccessMessage] = useState<string | null>(null);')

save_projects_target = """      setProjects(newProjects);
      setIsEditing(false);
      setCurrentProject({});
    } catch (error) {"""
save_projects_replacement = """      setProjects(newProjects);
      setIsEditing(false);
      setCurrentProject({});
      setSuccessMessage('تم الحفظ بنجاح');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {"""
content = content.replace(save_projects_target, save_projects_replacement)

render_target = """      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">إدارة مشاريع الأعمال (Portfolio)</h2>
        <button """
render_replacement = """      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">إدارة مشاريع الأعمال (Portfolio)</h2>
        <button """
render_target_full = render_target + """
          onClick={handleAddNew}
          className="bg-[#0284C7] text-white px-4 py-2 rounded-md font-bold hover:bg-[#0369A1] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة مشروع جديد
        </button>
      </div>"""
render_replacement_full = render_target_full + """
      {successMessage && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6 font-bold border border-green-200">
          {successMessage}
        </div>
      )}"""
content = content.replace(render_target_full, render_replacement_full)

with open('src/pages/dashboard/PortfolioManager.tsx', 'w') as f:
    f.write(content)
print("PortfolioManager patched")
