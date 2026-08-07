import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Loader2, Plus, Sparkles, Trash2, Upload } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { uploadDashboardImage } from '../../lib/mediaUpload';

type FieldType = 'text' | 'textarea' | 'rich_text' | 'image' | 'number' | 'boolean';

interface ArrayEditorProps {
  value: string;
  onChange: (val: string) => void;
  schema: {
    key: string;
    label: string;
    type: FieldType;
  }[];
  token?: string | null;
}

const richTextModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'clean'],
  ],
};

export default function ArrayEditor({ value, onChange, schema }: ArrayEditorProps) {
  const [items, setItems] = useState<any[]>([]);
  const [uploadingIndex, setUploadingIndex] = useState<{ index: number; key: string } | null>(null);
  const [generatingSEO, setGeneratingSEO] = useState<number | null>(null);

  useEffect(() => {
    try {
      const parsed = value ? JSON.parse(value) : [];
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error('Failed to parse array JSON', error);
      setItems([]);
    }
  }, [value]);

  const notifyChange = (newItems: any[]) => {
    setItems(newItems);
    onChange(JSON.stringify(newItems));
  };

  const addItem = () => {
    const newItem: Record<string, unknown> = {};
    schema.forEach((field) => {
      newItem[field.key] = field.type === 'number' ? 0 : field.type === 'boolean' ? false : '';
    });
    notifyChange([...items, newItem]);
  };

  const removeItem = (index: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;
    notifyChange(items.filter((_, itemIndex) => itemIndex !== index));
  };

  const updateItem = (index: number, key: string, val: unknown) => {
    const newItems = items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [key]: val } : item,
    );
    notifyChange(newItems);
  };

  const moveItem = (index: number, direction: 1 | -1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    const next = [...items];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    notifyChange(next);
  };

  const handleImageUpload = async (file: File | undefined, index: number, key: string) => {
    if (!file) return;
    setUploadingIndex({ index, key });
    try {
      const uploaded = await uploadDashboardImage(file, `content/${key}`);
      updateItem(index, key, uploaded.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'فشل رفع الصورة');
    } finally {
      setUploadingIndex(null);
    }
  };

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
        body: JSON.stringify({ title: titleToAnalyze, content: contentToAnalyze, type: 'مقال أو خدمة' }),
      });
      if (!response.ok) throw new Error('فشل توليد البيانات');
      const data = await response.json();
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        ...(data.title ? { seoTitle: data.title } : {}),
        ...(data.description ? { seoDescription: data.description } : {}),
      };
      notifyChange(newItems);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء محاولة توليد السيو بواسطة الذكاء الاصطناعي');
    } finally {
      setGeneratingSEO(null);
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="relative rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="absolute left-4 top-4 flex gap-2">
            <button type="button" onClick={() => moveItem(index, -1)} disabled={index === 0} className="p-1 text-gray-500 hover:text-gray-900 disabled:opacity-30" title="تحريك لأعلى">
              <ChevronUp className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => moveItem(index, 1)} disabled={index === items.length - 1} className="p-1 text-gray-500 hover:text-gray-900 disabled:opacity-30" title="تحريك لأسفل">
              <ChevronDown className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => removeItem(index)} className="p-1 text-red-500 hover:text-red-700" title="حذف العنصر">
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          <h4 className="mb-4 font-bold text-gray-700">عنصر #{index + 1}</h4>

          {schema.some((field) => field.key === 'seoTitle') && (!item.seoTitle || !item.seoDescription) && (
            <div className="mb-4 rounded bg-yellow-50 p-2 text-xs font-bold text-yellow-800">
              ⚠️ يرجى إكمال عنوان ووصف SEO لهذا العنصر.
            </div>
          )}

          {schema.some((field) => field.key === 'seoTitle') && (
            <div className="mb-4 flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 p-3">
              <div className="flex items-center gap-2 text-sm font-bold text-blue-800">
                <Sparkles className="h-5 w-5 text-blue-600" /> مساعد SEO
              </div>
              <button type="button" onClick={() => void generateSEO(index)} disabled={generatingSEO === index} className="flex items-center gap-2 rounded bg-[#0284C7] px-3 py-1.5 text-sm text-white disabled:opacity-50">
                {generatingSEO === index ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                توليد العنوان والوصف
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {schema.map((field) => {
              const isUploading = uploadingIndex?.index === index && uploadingIndex?.key === field.key;
              return (
                <div key={field.key}>
                  <label className="mb-1 block text-sm font-bold text-gray-700">{field.label}</label>

                  {field.type === 'textarea' ? (
                    <textarea value={item[field.key] || ''} onChange={(event) => updateItem(index, field.key, event.target.value)} className="h-24 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500" />
                  ) : field.type === 'rich_text' ? (
                    <div className="bg-white pb-10" dir="rtl">
                      <ReactQuill theme="snow" modules={richTextModules} value={item[field.key] || ''} onChange={(content) => updateItem(index, field.key, content)} className="min-h-48" />
                    </div>
                  ) : field.type === 'image' ? (
                    <div className="space-y-3">
                      <label className={`flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 ${isUploading ? 'border-gray-300 bg-gray-100' : 'border-[#0284C7] bg-white hover:bg-blue-50'}`}>
                        {isUploading ? <Loader2 className="mb-2 h-7 w-7 animate-spin text-gray-400" /> : <Upload className="mb-2 h-7 w-7 text-[#0284C7]" />}
                        <span className="text-sm font-bold text-gray-700">{isUploading ? 'جاري ضغط ورفع الصورة...' : item[field.key] ? 'استبدال الصورة من الجهاز' : 'رفع صورة من الجهاز'}</span>
                        <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={(event) => { void handleImageUpload(event.target.files?.[0], index, field.key); event.target.value = ''; }} />
                      </label>

                      {typeof item[field.key] === 'string' && item[field.key].trim() !== '' && (
                        <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white">
                          <img loading="lazy" decoding="async" src={item[field.key]} alt={field.label} className="h-40 w-full object-cover" />
                          <button type="button" onClick={() => updateItem(index, field.key, '')} className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700">
                            <Trash2 className="h-4 w-4" /> إزالة الصورة
                          </button>
                        </div>
                      )}
                    </div>
                  ) : field.type === 'boolean' ? (
                    <label className="flex cursor-pointer items-center gap-2">
                      <input type="checkbox" checked={Boolean(item[field.key])} onChange={(event) => updateItem(index, field.key, event.target.checked)} className="h-5 w-5 rounded border-gray-300 text-[#0284C7] focus:ring-[#0284C7]" />
                      <span className="text-gray-700">تفعيل</span>
                    </label>
                  ) : (
                    <input type={field.type === 'number' ? 'number' : 'text'} value={item[field.key] ?? ''} onChange={(event) => updateItem(index, field.key, field.type === 'number' ? Number(event.target.value) : event.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500" dir="auto" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <button type="button" onClick={addItem} className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-100 px-4 py-2 font-bold text-gray-700 transition-colors hover:bg-gray-200">
        <Plus className="h-4 w-4" /> إضافة عنصر جديد
      </button>
    </div>
  );
}
