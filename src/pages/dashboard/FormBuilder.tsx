import React, { useState } from 'react';
import { Plus, Trash2, Edit2, FileText, Settings, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

const DraggableAny = Draggable as any;

export default function FormBuilder() {
  const [forms, setForms] = useState([
    { id: '1', title: 'نموذج اتصل بنا الأساسي', fields: [
      { id: 'f1', label: 'الاسم', type: 'text', required: true },
      { id: 'f2', label: 'البريد الإلكتروني', type: 'email', required: true },
      { id: 'f3', label: 'الرسالة', type: 'textarea', required: true }
    ]},
    { id: '2', title: 'طلب عرض سعر', fields: [
      { id: 'f1', label: 'الاسم', type: 'text', required: true },
      { id: 'f2', label: 'رقم الهاتف', type: 'tel', required: true },
      { id: 'f3', label: 'نوع الخدمة', type: 'select', options: ['تركيب زجاج', 'صيانة', 'استشارة'], required: true }
    ]}
  ]);

  const [editingForm, setEditingForm] = useState<any>(null);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !editingForm) return;
    const items = Array.from(editingForm.fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setEditingForm({ ...editingForm, fields: items });
  };

  if (editingForm) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#0284C7]" />
            تعديل النموذج: {editingForm.title}
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setEditingForm(null)} className="px-4 py-2 border rounded">إلغاء</button>
            <button 
              onClick={() => {
                setForms(forms.map(f => f.id === editingForm.id ? editingForm : f));
                setEditingForm(null);
              }} 
              className="px-4 py-2 bg-[#0284C7] text-white rounded font-bold"
            >
              حفظ النموذج
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold mb-2">اسم النموذج</label>
          <input 
            type="text" 
            value={editingForm.title}
            onChange={e => setEditingForm({...editingForm, title: e.target.value})}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">حقول النموذج</h3>
            <button 
              onClick={() => setEditingForm({
                ...editingForm,
                fields: [...editingForm.fields, { id: `f${Date.now()}`, label: 'حقل جديد', type: 'text', required: false }]
              })}
              className="text-sm bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200"
            >
              + إضافة حقل
            </button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="fields">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {editingForm.fields.map((field: any, index: number) => (
                    
                    <DraggableAny key={field.id} draggableId={field.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex gap-4 p-4 border rounded bg-gray-50 items-center"
                        >
                          <div {...provided.dragHandleProps} className="text-gray-400 cursor-grab">
                            <GripVertical className="w-5 h-5" />
                          </div>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs mb-1">اسم الحقل</label>
                              <input 
                                type="text" 
                                value={field.label}
                                onChange={e => {
                                  const newFields = [...editingForm.fields];
                                  newFields[index].label = e.target.value;
                                  setEditingForm({...editingForm, fields: newFields});
                                }}
                                className="w-full border p-1.5 rounded text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs mb-1">نوع الحقل</label>
                              <select 
                                value={field.type}
                                onChange={e => {
                                  const newFields = [...editingForm.fields];
                                  newFields[index].type = e.target.value;
                                  setEditingForm({...editingForm, fields: newFields});
                                }}
                                className="w-full border p-1.5 rounded text-sm"
                              >
                                <option value="text">نص قصير</option>
                                <option value="textarea">نص طويل</option>
                                <option value="email">بريد إلكتروني</option>
                                <option value="tel">رقم هاتف</option>
                                <option value="select">قائمة منسدلة</option>
                                <option value="file">رفع ملف</option>
                              </select>
                            </div>
                            <div className="flex items-end pb-1">
                              <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={field.required}
                                  onChange={e => {
                                    const newFields = [...editingForm.fields];
                                    newFields[index].required = e.target.checked;
                                    setEditingForm({...editingForm, fields: newFields});
                                  }}
                                />
                                حقل إلزامي
                              </label>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              const newFields = [...editingForm.fields];
                              newFields.splice(index, 1);
                              setEditingForm({...editingForm, fields: newFields});
                            }}
                            className="text-red-500 hover:bg-red-50 p-2 rounded"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </DraggableAny>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6 text-[#0284C7]" />
          منشئ النماذج (Form Builder)
        </h2>
        <button 
          onClick={() => setEditingForm({ id: `form_${Date.now()}`, title: 'نموذج جديد', fields: [] })}
          className="flex items-center gap-2 bg-[#0284C7] text-white px-4 py-2 rounded font-bold hover:bg-[#0369A1]"
        >
          <Plus className="w-5 h-5" /> إنشاء نموذج
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {forms.map(form => (
          <div key={form.id} className="border border-gray-100 rounded-lg p-4 flex justify-between items-center bg-gray-50 hover:border-[#0284C7]/30 transition-colors">
            <div>
              <h3 className="font-bold text-gray-900">{form.title}</h3>
              <p className="text-sm text-gray-500">{form.fields.length} حقول</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingForm(form)} className="p-2 text-[#0284C7] hover:bg-[#0284C7]/10 rounded">
                <Edit2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => {
                  if(confirm('Are you sure?')) setForms(forms.filter(f => f.id !== form.id))
                }} 
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
