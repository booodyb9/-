import re

with open('src/pages/dashboard/ArrayEditor.tsx', 'r') as f:
    content = f.read()

import_stmt = "import { Sparkles, Loader2 } from 'lucide-react';"
if "Sparkles" not in content:
    content = content.replace("import { Plus, Trash2, ChevronUp, ChevronDown, Upload } from 'lucide-react';", "import { Plus, Trash2, ChevronUp, ChevronDown, Upload, Sparkles, Loader2 } from 'lucide-react';")

ai_helper_func = """
  const [generatingSEO, setGeneratingSEO] = useState<number | null>(null);

  const generateSEO = async (index: number) => {
    const item = items[index];
    const contentToAnalyze = item.description || item.content || item.answer || item.details || item.body || item.title || '';
    const titleToAnalyze = item.title || item.name || item.question || '';
    
    if (!contentToAnalyze && !titleToAnalyze) {
      alert('لا يوجد محتوى كافي لتوليد بيانات السيو');
      return;
    }

    setGeneratingSEO(index);
    try {
      const response = await fetch('/api/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleToAnalyze,
          content: contentToAnalyze,
          type: 'مقال أو خدمة'
        })
      });

      if (!response.ok) throw new Error('فشل توليد البيانات');
      const data = await response.json();
      
      const newItems = [...items];
      if (data.title) newItems[index] = { ...newItems[index], seoTitle: data.title };
      if (data.description) newItems[index] = { ...newItems[index], seoDescription: data.description };
      
      setItems(newItems);
      onChange(JSON.stringify(newItems));
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء محاولة توليد السيو بواسطة الذكاء الاصطناعي');
    } finally {
      setGeneratingSEO(null);
    }
  };
"""

if "const generateSEO = async" not in content:
    content = content.replace("const [uploadingIndex, setUploadingIndex] = useState<{index: number, key: string} | null>(null);", "const [uploadingIndex, setUploadingIndex] = useState<{index: number, key: string} | null>(null);\n" + ai_helper_func)

ai_button = """
          {schema.some(f => f.key === 'seoTitle') && (
            <div className="mb-4 flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="text-sm text-blue-800 font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                مساعد الذكاء الاصطناعي للسيو (SEO)
              </div>
              <button
                onClick={() => generateSEO(index)}
                disabled={generatingSEO === index}
                className="flex items-center gap-2 bg-[#0284C7] text-white px-3 py-1.5 rounded text-sm hover:bg-[#0369A1] transition-colors disabled:opacity-50"
              >
                {generatingSEO === index ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                توليد العنوان والوصف
              </button>
            </div>
          )}
"""

if "مساعد الذكاء الاصطناعي للسيو" not in content:
    content = content.replace("⚠️ تنبيه: يرجى إكمال إعدادات SEO (العنوان والوصف) في هذا العنصر لضمان أرشفة أفضل.\n            </div>\n          )}", "⚠️ تنبيه: يرجى إكمال إعدادات SEO (العنوان والوصف) في هذا العنصر لضمان أرشفة أفضل.\n            </div>\n          )}\n" + ai_button)


with open('src/pages/dashboard/ArrayEditor.tsx', 'w') as f:
    f.write(content)

print("ArrayEditor updated")
