import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Upload, Trash2, Search, File, Image as ImageIcon, Video, Folder, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { MediaFile } from './types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../lib/supabase';

interface Props {
  mediaFiles: MediaFile[];
  fetchMedia: () => void | Promise<void>;
  onSelect?: (url: string) => void;
  isModal?: boolean;
}

type MediaFilter = 'all' | 'image' | 'video' | 'pdf';

export default function MediaLibrary({ mediaFiles, fetchMedia, onSelect, isModal }: Props) {
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<MediaFilter>('all');
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles: File[] = e.target.files ? Array.from(e.target.files) : [];
    if (selectedFiles.length === 0) return;

    setUploading(true);
    try {
      const newFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          const fileExt = file.name.split('.').pop()?.toLowerCase() || 'bin';
          const fileName = `${uuidv4()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(fileName, file, { upsert: false, contentType: file.type || undefined });

          if (uploadError) throw uploadError;

          const { data } = supabase.storage.from('media').getPublicUrl(fileName);
          return {
            name: file.name,
            url: data.publicUrl,
            storage_path: `media/${fileName}`,
          };
        }),
      );

      const { error } = await supabase.from('media').insert(newFiles);
      if (error) {
        await supabase.storage
          .from('media')
          .remove(newFiles.map((file) => file.storage_path.replace(/^media\//, '')));
        throw error;
      }

      await fetchMedia();
      e.target.value = '';
    } catch (err) {
      console.error('Media upload failed:', err);
      alert('تعذر رفع الملفات. تحقق من الصلاحيات ونوع الملف ثم حاول مرة أخرى.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الملف؟')) return;

    try {
      const fileToDelete = mediaFiles.find((media) => media.id === id);
      if (!fileToDelete) return;

      const storagePath = fileToDelete.storage_path?.replace(/^media\//, '');
      if (storagePath) {
        const { error: storageError } = await supabase.storage.from('media').remove([storagePath]);
        if (storageError) throw storageError;
      }

      const { error } = await supabase.from('media').delete().eq('id', id);
      if (error) throw error;
      await fetchMedia();
    } catch (err) {
      console.error('Media delete failed:', err);
      alert('تعذر حذف الملف.');
    }
  };

  const copyToClipboard = async (url: string, id: string | number) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes || bytes <= 0) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
  };

  const filteredMedia = mediaFiles.filter((media) => {
    const url = media.url || '';
    const matchesSearch = media.name.toLowerCase().includes(search.toLowerCase());
    const isImage = /\.(jpe?g|gif|png|webp|svg)(\?.*)?$/i.test(url);
    const isVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
    const isPdf = /\.pdf(\?.*)?$/i.test(url);
    const matchesFilter =
      filter === 'all' ||
      (filter === 'image' && isImage) ||
      (filter === 'video' && isVideo) ||
      (filter === 'pdf' && isPdf);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${isModal ? 'h-full flex flex-col' : ''}`}>
      <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
          <Folder className="w-6 h-6 text-[#0284C7]" />
          مكتبة الوسائط
        </h2>
        <label className="bg-[#0284C7] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#0369A1] transition-colors cursor-pointer flex items-center gap-2">
          <Upload className="w-5 h-5" />
          {uploading ? 'جاري الرفع...' : 'رفع ملفات'}
          <input type="file" multiple accept="image/*,video/*,application/pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
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
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all' ? 'bg-[#0284C7] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>الكل</button>
          <button onClick={() => setFilter('image')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'image' ? 'bg-[#0284C7] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>صور</button>
          <button onClick={() => setFilter('video')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'video' ? 'bg-[#0284C7] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>فيديو</button>
          <button onClick={() => setFilter('pdf')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'pdf' ? 'bg-[#0284C7] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>PDF</button>
        </div>
      </div>

      <div className={`p-6 ${isModal ? 'overflow-y-auto flex-1' : ''}`}>
        {filteredMedia.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>لا توجد ملفات مطابقة.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredMedia.map((file) => {
              const isImage = /\.(jpe?g|gif|png|webp|svg)(\?.*)?$/i.test(file.url);
              const isVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(file.url);
              return (
                <div key={file.id} className="group relative border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-gray-50 cursor-pointer" onClick={() => onSelect?.(file.url)}>
                  <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                    {isImage ? (
                      <img loading="lazy" decoding="async" src={file.url} alt={file.name || 'صورة'} className="w-full h-full object-cover" />
                    ) : isVideo ? (
                      <Video className="w-12 h-12 text-gray-400" />
                    ) : (
                      <File className="w-12 h-12 text-gray-400" />
                    )}

                    {!isModal && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); void copyToClipboard(file.url, file.id); }} className="p-2 bg-white rounded-full text-gray-700 hover:text-[#0284C7]" title="نسخ الرابط">
                          {copiedId === file.id ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <LinkIcon className="w-5 h-5" />}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); void handleDelete(file.id); }} className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50" title="حذف">
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
                    {formatSize(file.size) && <p className="text-gray-500">{formatSize(file.size)}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
