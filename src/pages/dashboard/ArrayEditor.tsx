import { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface ArrayEditorProps {
  value: string; // JSON string
  onChange: (val: string) => void;
  schema: {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'image' | 'number';
  }[];
}

export default function ArrayEditor({ value, onChange, schema }: ArrayEditorProps) {
  const [items, setItems] = useState<any[]>([]);

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
                ) : (
                  <input 
                    type={field.type === 'number' ? 'number' : 'text'}
                    value={item[field.key] || ''} 
                    onChange={e => updateItem(index, field.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-blue-500"
                    dir={field.type === 'image' ? 'ltr' : 'auto'}
                    placeholder={field.type === 'image' ? 'رابط الصورة (URL)' : ''}
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
