import { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Upload } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface ArrayEditorProps {
  value: string; // JSON string
  onChange: (val: string) => void;
  schema: {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'image' | 'number';
  }[];
  token?: string | null;
}

export default function ArrayEditor({ value, onChange, schema, token }: ArrayEditorProps) {
  const [items, setItems] = useState<any[]>([]);
  const [uploadingIndex, setUploadingIndex] = useState<{index: number, key: string} | null>(null);

  useEffect(() => {
    try {
      if (value) {
        setItems(JSON.parse(value));
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
    const newItems = [...items];
    newItems.splice(index, 1);
    notifyChange(newItems);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number, key: string) => {
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
      
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
      
      const response = await fetch('/api/admin/images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token || ''}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: file.name,
          url: base64
        })
      });

      if (response.ok) {
        const uploadedImg = await response.json();
        const imageUrl = uploadedImg.image?.url || base64;
        updateItem(index, key, imageUrl);
      } else {
        alert('حدث خطأ أثناء رفع الصورة');
      }
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
                    {item[field.key] && (
                      <div className="relative w-full h-40 rounded-lg border border-gray-200 overflow-hidden group">
                         <img src={item[field.key]} alt="Preview" className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <p className="text-white text-sm font-bold">تم رفع الصورة بنجاح</p>
                         </div>
                      </div>
                    )}
                  </div>
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
