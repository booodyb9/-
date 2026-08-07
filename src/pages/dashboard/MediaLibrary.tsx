import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Copy, Search, File, Image as ImageIcon, Video, Folder, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { MediaFile } from './types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../lib/supabase';

interface Props {
  mediaFiles: MediaFile[];
  fetchMedia: () => void;
  onSelect?: (url: string) => void;
  isModal?: boolean;
}

export default function MediaLibrary({ mediaFiles, fetchMedia, onSelect, isModal }: Props) {
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'pdf'>('all');
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const files = Array.from(e.target.files);
      const newFiles = await Promise.all(files.map(async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from('media').getPublicUrl(filePath);
        
        return {
          name: file.name,
          url: data.publicUrl,
          storage_path: `media/${filePath}`
        };
      }));
      
      const { error } = await supabase.from('media').insert(newFiles);
      if (error) throw error;
      
      fetchMedia();
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    try {
      const fileToDelete = (mediaFiles || []).find(m => m.id === id);
      if (fileToDelete) {
        if (fileToDelete.storage_path) {
           const path = fileToDelete.storage_path.replace('media/', '');
           await supabase.storage.from('media').remove([path]);
        } else if (fileToDelete.url) {
           const urlParts = fileToDelete.url.split('/');
           const fileName = urlParts[urlParts.length - 1];
           await supabase.storage.from('media').remove([fileName]);
        }
      }
      const { error } = await supabase.from('media').delete().eq('id', id);
      if (error) throw error;
      fetchMedia();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const copyToClipboard = (url: string, id: string | number) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredMedia = (mediaFiles || []).filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || (m.type === filter || (filter === 'image' && m.url && m.url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i)) || (filter === 'video' && m.url && m.url.match(/\.(mp4|webm|ogg)$/i)));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${isModal ? 'h-full flex flex-col' : ''}`}>
      <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
          <Folder className="w-6 h-6 text-[#0284C7]" />
          مكتبة الوسائط
        </h2>
        <div className="flex gap-4 items-center">
          <label className="bg-[#0284C7] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#0369A1] transition-colors cursor-pointer flex items-center gap-2">
            <Upload className="w-5 h-5" />
            {uploading ? 'جاري الرفع...' : 'رفع ملفات'}
            <input type="file" multiple accept="image/*,video/*,application/pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 shrink-0">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="بحث في الملفات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0284C7]"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all' ? 'bg-[#0284C7] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>الكل</button>
          <button onClick={() => setFilter('image')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'image' ? 'bg-[#0284C7] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>صور</button>
          <button onClick={() => setFilter('video')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'video' ? 'bg-[#0284C7] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>فيديو</button>
          <button onClick={() => setFilter('document')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'document' ? 'bg-[#0284C7] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>مستندات</button>
        </div>
      </div>

      <div className={`p-6 ${isModal ? 'overflow-y-auto flex-1' : ''}`}>
        {(filteredMedia || []).length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>لا توجد ملفات. قم برفع بعض الملفات لتبدأ.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {(filteredMedia || []).map(file => (
              <div key={file.id} className="group relative border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-gray-50 cursor-pointer" onClick={() => onSelect && onSelect(file.url)}>
                <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                  {file.url && file.url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) ? (
                    <img loading="lazy" decoding="async" src={file.url} alt={file.name || 'صورة'} className="w-full h-full object-cover" />
                  ) : file.url && file.url.match(/\.(mp4|webm|ogg)$/i) ? (
                    <Video className="w-12 h-12 text-gray-400" />
                  ) : (
                    <File className="w-12 h-12 text-gray-400" />
                  )}
                  
                  {!isModal && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(file.url, file.id); }}
                        className="p-2 bg-white rounded-full text-gray-700 hover:text-[#0284C7]"
                        title="نسخ الرابط"
                      >
                        {copiedId === file.id ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <LinkIcon className="w-5 h-5" />}
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }}
                        className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50"
                        title="حذف"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  {isModal && (
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white px-3 py-1 rounded-full text-sm font-bold text-[#0284C7]">اختر</span>
                    </div>
                  )}
                </div>
                <div className="p-2 text-xs">
                  <p className="truncate font-medium" title={file.name}>{file.name}</p>
                  <p className="text-gray-500">{formatSize(file.size || 0)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
