with open('src/pages/dashboard/ContentManager.tsx', 'r') as f:
    content = f.read()

# Add success message state
if 'const [successMessage, setSuccessMessage] = useState<string | null>(null);' not in content:
    content = content.replace('const [savingContent, setSavingContent] = useState(false);',
                              'const [savingContent, setSavingContent] = useState(false);\n  const [successMessage, setSuccessMessage] = useState<string | null>(null);')

# Update handleSaveContent to show success message
save_content_target = """
      fetchContents();
      setEditingKey(null);
      setEditingContent(null);
    } catch (error) {
"""
save_content_replacement = """
      fetchContents();
      setEditingKey(null);
      setEditingContent(null);
      setSuccessMessage('تم الحفظ بنجاح!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
"""
content = content.replace(save_content_target, save_content_replacement)

# Render success message
render_target = """
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
        <Edit3 className="w-5 h-5 text-[#0284C7]" />
        إدارة محتوى الموقع
      </h2>
"""
render_replacement = """
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
        <Edit3 className="w-5 h-5 text-[#0284C7]" />
        إدارة محتوى الموقع
      </h2>
      {successMessage && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6 font-bold border border-green-200">
          {successMessage}
        </div>
      )}
"""
content = content.replace(render_target, render_replacement)

with open('src/pages/dashboard/ContentManager.tsx', 'w') as f:
    f.write(content)
print("Success patched")
