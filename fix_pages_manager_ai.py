import re

with open('src/pages/dashboard/PagesManager.tsx', 'r') as f:
    content = f.read()

import_stmt = "import { Sparkles, Loader2 } from 'lucide-react';"
if "Sparkles" not in content:
    content = content.replace("import { Plus, Edit3, Trash2, GripVertical, Settings } from 'lucide-react';", "import { Plus, Edit3, Trash2, GripVertical, Settings, Sparkles, Loader2 } from 'lucide-react';")

ai_helper_func = """
  const [generatingSEO, setGeneratingSEO] = useState(false);

  const generatePageSEO = async () => {
    const titleToAnalyze = editingPage.parsed?.title || '';
    const contentToAnalyze = editingPage.parsed?.content || '';
    
    if (!contentToAnalyze && !titleToAnalyze) {
      alert('لا يوجد محتوى كافي لتوليد بيانات السيو');
      return;
    }

    setGeneratingSEO(true);
    try {
      const response = await fetch('/api/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleToAnalyze,
          content: contentToAnalyze,
          type: 'صفحة'
        })
      });

      if (!response.ok) throw new Error('فشل توليد البيانات');
      const data = await response.json();
      
      let updatedSeo = { ...editingPage.parsed?.seo };
      if (data.title) updatedSeo.title = data.title;
      if (data.description) updatedSeo.description = data.description;
      
      setEditingPage({
        ...editingPage, 
        parsed: {
          ...editingPage.parsed, 
          seo: updatedSeo
        }
      });
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء محاولة توليد السيو بواسطة الذكاء الاصطناعي');
    } finally {
      setGeneratingSEO(false);
    }
  };
"""

if "generatePageSEO" not in content:
    content = content.replace("const [saving, setSaving] = useState(false);", "const [saving, setSaving] = useState(false);\n" + ai_helper_func)

ai_button = """
              <div className="mb-4 flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="text-sm text-blue-800 font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  مساعد الذكاء الاصطناعي
                </div>
                <button
                  onClick={generatePageSEO}
                  disabled={generatingSEO}
                  className="flex items-center gap-2 bg-[#0284C7] text-white px-3 py-1.5 rounded text-sm hover:bg-[#0369A1] transition-colors disabled:opacity-50"
                >
                  {generatingSEO ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  توليد العنوان والوصف
                </button>
              </div>
"""

if "مساعد الذكاء الاصطناعي" not in content:
    content = content.replace("⚠️ تنبيه: يرجى إكمال إعدادات SEO (العنوان والوصف) لضمان أرشفة أفضل.\n                </div>\n              )}", "⚠️ تنبيه: يرجى إكمال إعدادات SEO (العنوان والوصف) لضمان أرشفة أفضل.\n                </div>\n              )}\n" + ai_button)

with open('src/pages/dashboard/PagesManager.tsx', 'w') as f:
    f.write(content)

print("PagesManager updated")
