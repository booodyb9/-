import React, { useState, useEffect, useCallback } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { LayoutTemplate, GripVertical, Eye, EyeOff, Save } from 'lucide-react';

const AVAILABLE_SECTIONS = [
  { id: 'hero', label: 'البانر الرئيسي (Hero)' },
  { id: 'services', label: 'الخدمات (Services)' },
  { id: 'portfolio', label: 'معرض الأعمال (Portfolio)' },
  { id: 'features', label: 'المميزات (Features)' },
  { id: 'visualizer', label: 'متخيل الزجاج (Visualizer)' },
  { id: 'stats', label: 'الإحصائيات (Stats)' },
  { id: 'partners', label: 'شركاء النجاح (Partners)' },
  { id: 'portfolio', label: 'معرض الأعمال (Portfolio)' },
  { id: 'testimonials', label: 'آراء العملاء (Testimonials)' },
  { id: 'faq', label: 'الأسئلة الشائعة (FAQ)' },
  { id: 'blog', label: 'المدونة (Blog)' },
  { id: 'contact', label: 'تواصل معنا (Contact)' }
];

export default function HomepageBuilder() {
  const { getContent, updateContent } = useContent();
  const [sections, setSections] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const savedContent = getContent('homepage_sections');
    if (savedContent?.body) {
      try {
        const parsed = JSON.parse(savedContent.body);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSections(parsed);
          return;
        }
      } catch (e) {}
    }
    
    // Default layout
    setSections(AVAILABLE_SECTIONS.map((s, idx) => ({ ...s, isVisible: idx < 6 })));
  }, [getContent]);

  const handleSave = async () => {
    setSaving(true);
    try {
      updateContent('homepage_sections', JSON.stringify(sections));
      
      const stored = localStorage.getItem('mock_contents');
      let currentContents = stored ? JSON.parse(stored) : [];
      
      const index = currentContents.findIndex((c: any) => c.key === 'homepage_sections');
      const newObj = {
        id: 'homepage_sections',
        key: 'homepage_sections',
        title: 'ترتيب الصفحة الرئيسية',
        type: 'array',
        body: JSON.stringify(sections),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      if (index >= 0) {
        currentContents[index] = newObj;
      } else {
        currentContents.push(newObj);
      }
      localStorage.setItem('mock_contents', JSON.stringify(currentContents));

      alert('تم حفظ الترتيب بنجاح');
    } catch (e) {
      console.error(e);
      alert('حدث خطأ');
    }
    setSaving(false);
  };

  const toggleVisibility = (idx: number) => {
    const newSections = [...sections];
    newSections[idx].isVisible = !newSections[idx].isVisible;
    setSections(newSections);
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const newSections = [...sections];
    const temp = newSections[idx - 1];
    newSections[idx - 1] = newSections[idx];
    newSections[idx] = temp;
    setSections(newSections);
  };

  const moveDown = (idx: number) => {
    if (idx === sections.length - 1) return;
    const newSections = [...sections];
    const temp = newSections[idx + 1];
    newSections[idx + 1] = newSections[idx];
    newSections[idx] = temp;
    setSections(newSections);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <LayoutTemplate className="w-5 h-5 text-[#0284C7]" />
          بناء الصفحة الرئيسية
        </h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#0284C7] text-white px-6 py-2 rounded-md hover:bg-[#0369A1] transition-colors flex items-center gap-2 font-bold"
        >
          <Save className="w-4 h-4" />
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>

      <p className="text-gray-600 mb-6 text-sm">
        تحكم في ترتيب الأقسام على الصفحة الرئيسية وإخفاء/إظهار الأقسام حسب الحاجة.
      </p>

      <div className="space-y-3">
        {sections.map((section, idx) => (
          <div key={section.id} className={`border rounded-lg p-4 flex items-center gap-4 transition-colors ${section.isVisible ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
            <div className="flex flex-col gap-1">
               <button onClick={() => moveUp(idx)} className="text-gray-400 hover:text-gray-700" disabled={idx === 0}>↑</button>
               <button onClick={() => moveDown(idx)} className="text-gray-400 hover:text-gray-700" disabled={idx === sections.length - 1}>↓</button>
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{section.label}</h3>
              <p className="text-xs text-gray-500 font-mono mt-1">{section.id}</p>
            </div>

            <button 
              onClick={() => toggleVisibility(idx)}
              className={`p-2 rounded-md ${section.isVisible ? 'text-[#0284C7] hover:bg-[#0284C7]/10' : 'text-gray-400 hover:bg-gray-100'}`}
              title={section.isVisible ? 'إخفاء القسم' : 'إظهار القسم'}
            >
              {section.isVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
