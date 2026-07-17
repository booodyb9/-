import { memo, useState, useCallback, useMemo } from 'react';
import { Edit3, Save } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Content } from './types';
import ArrayEditor from './ArrayEditor';
import { useContent } from '../../contexts/ContentContext';

interface ContentManagerProps {
  contents: Content[];
  fetchContents: () => void;
  token: string | null;
}

type SectionType = 'rich_text' | 'array';

interface Section {
  key: string;
  title: string;
  type: SectionType;
  schema?: any[];
}

const SECTIONS: Section[] = [
  { key: 'hero_content', title: 'الرئيسية (نصوص البانر)', type: 'rich_text' },
  { 
    key: 'hero_images', 
    title: 'صور البانر الرئيسي', 
    type: 'array',
    schema: [
      { key: 'alt', label: 'وصف الصورة (Alt Text)', type: 'text' },
      { key: 'url', label: 'رابط الصورة', type: 'image' },
    ]
  },
  { key: 'services_intro', title: 'مقدمة الخدمات', type: 'rich_text' },
  { 
    key: 'services_items', 
    title: 'قائمة الخدمات', 
    type: 'array',
    schema: [
      { key: 'title', label: 'عنوان الخدمة', type: 'text' },
      { key: 'description', label: 'وصف الخدمة', type: 'textarea' },
      { key: 'image', label: 'رابط الصورة', type: 'image' },
      { key: 'icon', label: 'اسم الأيقونة (مثال: Home)', type: 'text' },
    ]
  },
  { 
    key: 'features_intro', 
    title: 'مقدمة المميزات (لماذا تختارنا)', 
    type: 'rich_text' 
  },
  { 
    key: 'features_items', 
    title: 'قائمة المميزات', 
    type: 'array',
    schema: [
      { key: 'title', label: 'العنوان', type: 'text' },
      { key: 'description', label: 'الوصف', type: 'textarea' },
      { key: 'icon', label: 'اسم الأيقونة (مثال: Shield)', type: 'text' },
    ]
  },
  {
    key: 'features_image',
    title: 'صورة لماذا تختارنا',
    type: 'array',
    schema: [
      { key: 'image', label: 'رابط الصورة', type: 'image' },
    ]
  },
  { 
    key: 'process_items', 
    title: 'خطوات العمل', 
    type: 'array',
    schema: [
      { key: 'title', label: 'عنوان الخطوة', type: 'text' },
      { key: 'description', label: 'وصف الخطوة', type: 'textarea' },
    ]
  },
  {
    key: 'trusted_partners',
    title: 'شركاء النجاح',
    type: 'array',
    schema: [
      { key: 'name', label: 'اسم الشريك', type: 'text' },
      { key: 'logo', label: 'شعار الشريك (رابط الصورة)', type: 'image' },
    ]
  },
  { 
    key: 'gallery_items', 
    title: 'معرض الأعمال (الصور)', 
    type: 'array',
    schema: [
      { key: 'title', label: 'عنوان المشروع', type: 'text' },
      { key: 'category', label: 'القسم (مثل: واجهات, قواطع)', type: 'text' },
      { key: 'description', label: 'وصف المشروع', type: 'textarea' },
      { key: 'image', label: 'رابط الصورة', type: 'image' },
      { key: 'className', label: 'كلاس CSS (اختياري - للتحكم بالحجم)', type: 'text' },
    ]
  },
  { 
    key: 'testimonials_items', 
    title: 'آراء العملاء', 
    type: 'array',
    schema: [
      { key: 'name', label: 'اسم العميل', type: 'text' },
      { key: 'role', label: 'المنصب/الشركة', type: 'text' },
      { key: 'content', label: 'نص الرأي', type: 'textarea' },
      { key: 'rating', label: 'التقييم (1-5)', type: 'number' },
      { key: 'image', label: 'رابط صورة العميل', type: 'image' },
    ]
  },
  { 
    key: 'faq_items', 
    title: 'الأسئلة الشائعة', 
    type: 'array',
    schema: [
      { key: 'question', label: 'السؤال', type: 'text' },
      { key: 'answer', label: 'الإجابة', type: 'textarea' },
    ]
  },
  { key: 'blog_intro', title: 'مقدمة المدونة', type: 'rich_text' },
  { 
    key: 'blog_items', 
    title: 'مقالات المدونة', 
    type: 'array',
    schema: [
      { key: 'title', label: 'عنوان المقال', type: 'text' },
      { key: 'category', label: 'القسم', type: 'text' },
      { key: 'excerpt', label: 'مقتطف (وصف قصير)', type: 'textarea' },
      { key: 'date', label: 'التاريخ', type: 'text' },
      { key: 'image', label: 'رابط الصورة', type: 'image' },
    ]
  },
  { key: 'contact_content', title: 'تواصل معنا', type: 'rich_text' },
];

const ContentManager = memo(({ contents, fetchContents, token }: ContentManagerProps) => {
  const { refreshContent } = useContent();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [savingContent, setSavingContent] = useState(false);

  const handleSaveContent = useCallback(async () => {
    if (!editingContent) return;
    setSavingContent(true);
    try {
      const { supabase } = await import('../../lib/supabase');
      const { error } = await supabase
        .from('contents')
        .upsert({
          key: editingContent.key,
          title: editingContent.title,
          body: editingContent.body,
          type: editingContent.type,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (!error) {
        alert('تم حفظ المحتوى بنجاح');
        fetchContents();
        refreshContent();
        setEditingKey(null);
        setEditingContent(null);
      } else {
        alert('فشل في حفظ المحتوى: ' + error.message);
      }
    } catch (error) {
      console.error("Failed to save content:", error);
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setSavingContent(false);
    }
  }, [editingContent, fetchContents, token]);

  const renderedSections = useMemo(() => {
    return SECTIONS.map(section => (
      <div 
        key={section.key}
        className="border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => {
          const existing = contents.find(c => c.key === section.key);
          setEditingKey(section.key);
          setEditingContent(existing || { 
            key: section.key, 
            title: section.title, 
            body: section.type === 'array' ? '[]' : '', 
            type: section.type 
          });
        }}
      >
        <h3 className="font-bold text-gray-900 mb-2">{section.title}</h3>
        <p className="text-sm text-gray-500 mb-4">
          {section.type === 'array' ? 'تعديل قائمة العناصر' : 'تعديل النصوص والصور'}
        </p>
        <button className="text-[#0284C7] font-bold">تعديل</button>
      </div>
    ));
  }, [contents]);

  const currentSectionInfo = useMemo(() => {
    return SECTIONS.find(s => s.key === editingKey);
  }, [editingKey]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
        <Edit3 className="w-5 h-5 text-[#0284C7]" />
        إدارة محتوى الموقع
      </h2>
      
      {!editingContent ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderedSections}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="text-xl font-bold">تعديل: {currentSectionInfo?.title}</h3>
            <div className="flex gap-2 w-full md:w-auto">
              <button onClick={() => {
                setEditingKey(null);
                setEditingContent(null);
              }} className="flex-1 md:flex-none text-gray-500 hover:text-gray-900 font-bold bg-white px-4 py-2 rounded border border-gray-300">
                العودة / إلغاء
              </button>
              <button 
                onClick={handleSaveContent}
                disabled={savingContent}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#0284C7] text-white px-6 py-2 rounded hover:bg-[#0369A1] transition-colors font-bold disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {savingContent ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </div>
          </div>
          
          <div className="hidden">
            <label className="block text-sm font-bold text-gray-700 mb-2">العنوان</label>
            <input 
              type="text" 
              value={editingContent.title}
              onChange={e => setEditingContent({...editingContent, title: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[#0284C7] outline-none"
            />
          </div>

          <div>
            {currentSectionInfo?.type === 'rich_text' ? (
              <>
                <label className="block text-sm font-bold text-gray-700 mb-2">المحتوى (يدعم التنسيق وإضافة صور)</label>
                <div className="ltr text-left" dir="ltr">
                  <ReactQuill 
                    theme="snow" 
                    value={editingContent.body} 
                    onChange={val => setEditingContent({...editingContent, body: val})} 
                    className="h-[400px] mb-12"
                  />
                </div>
              </>
            ) : currentSectionInfo?.type === 'array' ? (
              <>
                <label className="block text-sm font-bold text-gray-700 mb-2">إدارة العناصر</label>
                <ArrayEditor 
                  value={editingContent.body} 
                  onChange={val => setEditingContent({...editingContent, body: val})} 
                  schema={currentSectionInfo.schema || []}
                  token={token}
                />
              </>
            ) : null}
          </div>

          <button 
            onClick={handleSaveContent}
            disabled={savingContent}
            className="flex items-center justify-center w-full md:w-auto gap-2 bg-[#0284C7] text-white px-8 py-3 rounded-md hover:bg-[#0369A1] transition-colors font-bold disabled:opacity-50 mt-8"
          >
            <Save className="w-5 h-5" />
            {savingContent ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      )}
    </div>
  );
});

ContentManager.displayName = 'ContentManager';
export default ContentManager;

