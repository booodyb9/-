import React, { useState } from 'react';
import { Plus, Edit3, Trash2, GripVertical, Settings } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase, saveContent } from '../../lib/supabase';
import { useContent } from '../../contexts/ContentContext';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Props {
  pages: any[];
  fetchContents: () => void;
}

const AVAILABLE_SECTIONS = [
  'Hero', 'About', 'Services', 'Process', 'GlassVisualizer', 'ProjectStats', 
  'Features', 'Gallery', 'Testimonials', 'TrustedPartners', 
  'FAQ', 'Maintenance', 'Blog', 'Contact', 'CustomHTML'
];

const DraggableAny = Draggable as any;

export default function PagesManager({ pages, fetchContents }: Props) {
  const parsedPages = pages.map(p => ({ ...p, parsed: p.parsed || (p.body ? JSON.parse(p.body) : {}) }));
  const { updateContent } = useContent();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const handleAddNew = () => {
    const newPage = {
      key: `page_${uuidv4()}`,
      type: 'page',
      parsed: {
        title: 'صفحة جديدة',
        slug: 'new-page',
        content: '',
        sections: [],
        seo: { title: '', description: '' },
        status: 'draft',
        featuredImage: ''
      }
    };
    setEditingPage(newPage);
    setEditingKey(newPage.key);
  };

  const handleSave = async () => {
    if (!editingPage.parsed.title || !editingPage.parsed.slug) {
      alert('يرجى إدخال عنوان ورابط الصفحة');
      return;
    }

    setSaving(true);
    try {
      await saveContent(editingPage.key, editingPage.parsed.title, 'page', JSON.stringify(editingPage.parsed));
      updateContent(editingPage.key, JSON.stringify(editingPage.parsed));
      
      
      alert('تم الحفظ بنجاح');
      fetchContents();
      setEditingKey(null);
      setEditingPage(null);
    } catch (error: any) {
      alert('خطأ أثناء الحفظ: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصفحة؟')) return;
    try {
      
      const { error } = await supabase.from('contents').delete().eq('key', key);
      if (error) throw error;
      fetchContents();
    } catch (error: any) {
      alert('خطأ: ' + error.message);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(editingPage.parsed.sections || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setEditingPage({
      ...editingPage,
      parsed: { ...editingPage.parsed, sections: items }
    });
  };

  const addSection = (sectionName: string) => {
    setEditingPage({
      ...editingPage,
      parsed: { ...editingPage.parsed, sections: [...(editingPage.parsed.sections || []), sectionName] }
    });
  };

  const removeSection = (index: number) => {
    const items = Array.from(editingPage.parsed.sections || []);
    items.splice(index, 1);
    setEditingPage({
      ...editingPage,
      parsed: { ...editingPage.parsed, sections: items }
    });
  };

  if (editingPage) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">تعديل الصفحة: {editingPage.parsed.title}</h2>
          <div className="flex gap-2">
            <button onClick={() => setEditingKey(null)} className="px-4 py-2 border rounded">إلغاء</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-[#0284C7] text-white rounded font-bold">
              {saving ? 'جاري الحفظ...' : 'حفظ الصفحة'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">عنوان الصفحة</label>
                <input 
                  type="text" 
                  value={editingPage.parsed.title}
                  onChange={e => setEditingPage({...editingPage, parsed: {...editingPage.parsed, title: e.target.value}})}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">رابط الصفحة (Slug)</label>
                <input 
                  type="text" 
                  value={editingPage.parsed.slug}
                  onChange={e => setEditingPage({...editingPage, parsed: {...editingPage.parsed, slug: e.target.value}})}
                  className="w-full border p-2 rounded text-left" dir="ltr"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold mb-4">محتوى الصفحة (Rich Text)</h3>
              <div className="ltr text-left bg-white" dir="ltr">
                <ReactQuill 
                  theme="snow"
                  value={editingPage.parsed.content || ''}
                  onChange={val => setEditingPage({...editingPage, parsed: {...editingPage.parsed, content: val}})}
                  className="h-64 mb-12"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold mb-4">أقسام الصفحة (Sections Builder)</h3>
              
              <div className="mb-4">
                <select 
                  className="border p-2 rounded ml-2"
                  onChange={(e) => {
                    if (e.target.value) {
                      addSection(e.target.value);
                      e.target.value = '';
                    }
                  }}
                >
                  <option value="">+ إضافة قسم جديد</option>
                  {AVAILABLE_SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {(editingPage.parsed.sections || []).map((sec: string, index: number) => (
                        
                        <DraggableAny key={`${sec}-${index}`} draggableId={`${sec}-${index}`} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center justify-between p-3 border rounded bg-gray-50 group"
                            >
                              <div className="flex items-center gap-3">
                                <div {...provided.dragHandleProps} className="text-gray-400 cursor-grab">
                                  <GripVertical className="w-5 h-5" />
                                </div>
                                <span className="font-bold">{sec}</span>
                              </div>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button type="button" className="text-gray-500 hover:text-[#0284C7] p-1"><Settings className="w-4 h-4" /></button>
                                <button type="button" onClick={() => removeSection(index)} className="text-gray-500 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                              </div>
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

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-bold mb-4 border-b pb-2">حالة الصفحة</h3>
              <select 
                value={editingPage.parsed.status || 'draft'} 
                onChange={(e) => setEditingPage({...editingPage, parsed: {...editingPage.parsed, status: e.target.value}})}
                className="w-full border p-2 rounded mb-4"
              >
                <option value="published">منشورة</option>
                <option value="draft">مسودة</option>
              </select>

              <label className="block text-sm font-bold mb-2">الصورة البارزة (رابط)</label>
              <input 
                type="text" 
                value={editingPage.parsed.featuredImage || ''}
                onChange={e => setEditingPage({...editingPage, parsed: {...editingPage.parsed, featuredImage: e.target.value}})}
                className="w-full border p-2 rounded text-left mb-2" dir="ltr"
              />
              {editingPage.parsed.featuredImage && (
                <img src={editingPage.parsed.featuredImage} alt="Preview" className="w-full h-32 object-cover rounded" />
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-bold mb-4 border-b pb-2">إعدادات SEO</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Meta Title</label>
                  <input 
                    type="text" 
                    value={editingPage.parsed.seo?.title || ''}
                    onChange={e => setEditingPage({...editingPage, parsed: {...editingPage.parsed, seo: {...editingPage.parsed.seo, title: e.target.value}}})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Meta Description</label>
                  <textarea 
                    value={editingPage.parsed.seo?.description || ''}
                    onChange={e => setEditingPage({...editingPage, parsed: {...editingPage.parsed, seo: {...editingPage.parsed.seo, description: e.target.value}}})}
                    className="w-full border p-2 rounded h-24"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">إدارة الصفحات (CMS)</h2>
        <button onClick={handleAddNew} className="flex items-center gap-2 bg-[#0284C7] text-white px-4 py-2 rounded font-bold hover:bg-[#0369A1]">
          <Plus className="w-5 h-5" /> إنشـاء صفحة جديدة
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 text-right">عنوان الصفحة</th>
              <th className="p-4 text-left" dir="ltr">الرابط (Slug)</th>
              <th className="p-4 text-center">الحالة</th>
              <th className="p-4 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {parsedPages.length === 0 ? (
                <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">لا توجد صفحات إضافية، يمكنك إنشاء صفحة جديدة.</td>
                </tr>
            ) : parsedPages.map((page: any) => (
              <tr key={page.key} className="border-b hover:bg-gray-50">
                <td className="p-4 font-bold text-gray-900">{page.parsed.title}</td>
                <td className="p-4 text-left" dir="ltr"><a href={`/${page.parsed.slug}`} target="_blank" className="text-blue-600 hover:underline">/{page.parsed.slug}</a></td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${page.parsed.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {page.parsed.status === 'published' ? 'منشورة' : 'مسودة'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button 
                      onClick={() => {
                        setEditingKey(page.key);
                        setEditingPage(page);
                      }}
                      className="p-2 text-[#0284C7] hover:bg-[#0284C7]/10 rounded transition-colors"
                      title="تعديل"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(page.key)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
