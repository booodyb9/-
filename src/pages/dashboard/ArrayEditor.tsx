import { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Upload, Sparkles, Loader2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';


interface ArrayEditorProps {
  value: string; // JSON string
  onChange: (val: string) => void;
  schema: {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'image' | 'number' | 'boolean';
  }[];
  token?: string | null;
}

export default function ArrayEditor({ value, onChange, schema, token }: ArrayEditorProps) {
  const [items, setItems] = useState<any[]>([]);
  const [uploadingIndex, setUploadingIndex] = useState<{index: number, key: string} | null>(null);

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


  useEffect(() => {
    try {
      if (value) {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        } else {
          setItems([]);
        }
      } else {
        setItems([]);
      }
    } catch (e) {
      console.error("Failed to parse array JSON", e);
      setItems([]);
    }
  }, [value]);

  const notifyChange = (newItems: any[]) => {
    setItems(newItems);
    onChange(JSON.stringify(newItems));
  };

  const addItem = () => {
    const newItem: any = {};
    schema.forEach(field => {
      newItem[field.key] = field.type === 'number' ? 0 : '';
    });
    notifyChange([...items, newItem]);
  };

  const removeItem = (index: number) => {
    if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
      const newItems = [...items];
      newItems.splice(index, 1);
      notifyChange(newItems);
    }
  };

  const updateItem = (index: number, key: string, val: any) => {
    const newItems = [...items];
    newItems[index][key] = val;
    notifyChange(newItems);
  };

  const moveItem = (index: number, direction: 1 | -1) => {
    if (index + direction < 0 || index + direction >= items.length) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + direction];
    newItems[index + direction] = temp;
    notifyChange(newItems);
  };

  const handleImageUpload = async (e: import("react").ChangeEvent<HTMLInputElement>, index: number, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIndex({ index, key });
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: false
      };
      
      const compressedFile = await imageCompression(file, options);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, compressedFile);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('media').getPublicUrl(filePath);
      
      const newImage = { 
         name: file.name,
         url: data.publicUrl,
         storage_path: `media/${filePath}`
       };
      
      const { error: insertError } = await supabase.from('media').insert([newImage]);
      if (insertError) console.error("Media insert error:", insertError);
      updateItem(index, key, newImage.url);
    } catch (error) {
      console.error("Upload error:", error);
      alert('فشل رفع الصورة');
    } finally {
      setUploadingIndex(null);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="border border-gray-200 p-4 rounded-lg bg-gray-50 relative">
          <div className="absolute top-4 left-4 flex gap-2">
            <button onClick={() => moveItem(index, -1)} disabled={index === 0} className="p-1 text-gray-500 hover:text-gray-900 disabled:opacity-30">
              <ChevronUp className="w-5 h-5" />
            </button>
            <button onClick={() => moveItem(index, 1)} disabled={index === items.length - 1} className="p-1 text-gray-500 hover:text-gray-900 disabled:opacity-30">
              <ChevronDown className="w-5 h-5" />
            </button>
            <button onClick={() => removeItem(index)} className="p-1 text-red-500 hover:text-red-700">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          
          <h4 className="font-bold text-gray-700 mb-4">عنصر #{index + 1}</h4>

          {schema.some(f => f.key === 'seoTitle') && (!item.seoTitle || !item.seoDescription) && (
            <div className="bg-yellow-50 text-yellow-800 p-2 rounded mb-4 text-xs font-bold flex gap-2 items-center">
              ⚠️ تنبيه: يرجى إكمال إعدادات SEO (العنوان والوصف) في هذا العنصر لضمان أرشفة أفضل.
            </div>
          )}

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


          
          <div className="grid grid-cols-1 gap-4">
            {schema.map(field => (
              <div key={field.key}>
                <label className="block text-sm font-bold text-gray-700 mb-1">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea 
                    value={item[field.key] || ''} 
                    onChange={e => updateItem(index, field.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-blue-500 h-24"
                  />
                ) : field.type === 'image' ? (
                  <div className="space-y-3">
                    <label className={`
                      flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                      ${uploadingIndex?.index === index && uploadingIndex?.key === field.key 
                        ? 'bg-gray-100 border-gray-300' 
                        : 'bg-white border-[#0284C7] hover:bg-blue-50'}
                    `}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className={`w-8 h-8 mb-2 ${uploadingIndex?.index === index && uploadingIndex?.key === field.key ? 'text-gray-400' : 'text-[#0284C7]'}`} />
                        <p className="text-sm font-bold text-gray-700">
                          {uploadingIndex?.index === index && uploadingIndex?.key === field.key ? 'جاري الرفع...' : 'انقر لرفع صورة من الجهاز'}
                        </p>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageUpload(e, index, field.key)}
                        disabled={uploadingIndex?.index === index && uploadingIndex?.key === field.key}
                      />
                    </label>
                    {item[field.key] && typeof item[field.key] === 'string' && item[field.key].trim() !== '' && (
                      <div className="relative w-full h-40 rounded-lg border border-gray-200 overflow-hidden group">
                         <img loading="lazy" decoding="async" src={item[field.key]} alt="Preview" className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <p className="text-white text-sm font-bold">تم رفع الصورة بنجاح</p>
                         </div>
                      </div>
                    )}
                  </div>
                
                ) : field.type === 'boolean' ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={!!item[field.key]} 
                      onChange={e => updateItem(index, field.key, e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-[#0284C7] focus:ring-[#0284C7]"
                    />
                    <span className="text-gray-700 font-bold">{field.label}</span>
                  </label>
                ) : (
                  <input 
                    type={field.type === 'number' ? 'number' : 'text'}
                    value={item[field.key] || ''} 
                    onChange={e => updateItem(index, field.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-blue-500"
                    dir="auto"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <button 
        onClick={addItem}
        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors font-bold w-full justify-center"
      >
        <Plus className="w-4 h-4" />
        إضافة عنصر جديد
      </button>
    </div>
  );
}
