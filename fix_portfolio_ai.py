import re

with open('src/pages/dashboard/PortfolioManager.tsx', 'r') as f:
    content = f.read()

if "Sparkles" not in content:
    content = content.replace("import { Plus, Edit, Trash2, Eye, EyeOff, Star, Copy, ExternalLink, Image as ImageIcon } from 'lucide-react';", "import { Plus, Edit, Trash2, Eye, EyeOff, Star, Copy, ExternalLink, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';")

ai_helper_func = """
  const [generatingSEO, setGeneratingSEO] = useState(false);

  const generateProjectSEO = async () => {
    const titleToAnalyze = currentProject.title || '';
    const contentToAnalyze = currentProject.description || '';
    
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
          type: 'مشروع'
        })
      });

      if (!response.ok) throw new Error('فشل توليد البيانات');
      const data = await response.json();
      
      setCurrentProject({
        ...currentProject,
        seoTitle: data.title || currentProject.seoTitle,
        seoDescription: data.description || currentProject.seoDescription
      });
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء محاولة توليد السيو بواسطة الذكاء الاصطناعي');
    } finally {
      setGeneratingSEO(false);
    }
  };
"""

if "generateProjectSEO" not in content:
    content = content.replace("const [saving, setSaving] = useState(false);", "const [saving, setSaving] = useState(false);\n" + ai_helper_func)

ai_button = """
            <div className="mb-4 flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="text-sm text-blue-800 font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                مساعد الذكاء الاصطناعي
              </div>
              <button
                onClick={generateProjectSEO}
                disabled={generatingSEO}
                className="flex items-center gap-2 bg-[#0284C7] text-white px-3 py-1.5 rounded text-sm hover:bg-[#0369A1] transition-colors disabled:opacity-50"
              >
                {generatingSEO ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                توليد العنوان والوصف
              </button>
            </div>
"""

if "مساعد الذكاء الاصطناعي" not in content:
    content = content.replace("⚠️ تنبيه: يرجى إكمال إعدادات SEO (العنوان والوصف) لضمان أرشفة أفضل.\n              </div>\n            )}", "⚠️ تنبيه: يرجى إكمال إعدادات SEO (العنوان والوصف) لضمان أرشفة أفضل.\n              </div>\n            )}\n" + ai_button)

with open('src/pages/dashboard/PortfolioManager.tsx', 'w') as f:
    f.write(content)

print("PortfolioManager updated")
