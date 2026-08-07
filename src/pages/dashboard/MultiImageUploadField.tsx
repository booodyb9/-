import { useState } from 'react';
import { GripVertical, ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { uploadDashboardImage } from '../../lib/mediaUpload';

interface MultiImageUploadFieldProps {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
}

export default function MultiImageUploadField({ label, values, onChange, folder = 'dashboard/gallery' }: MultiImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const media = await uploadDashboardImage(file, folder);
        uploaded.push(media.url);
      }
      onChange([...values, ...uploaded]);
    } catch (error) {
      console.error('Gallery upload failed:', error);
      alert(error instanceof Error ? error.message : 'تعذر رفع صور المعرض.');
    } finally {
      setUploading(false);
    }
  };

  const move = (index: number, offset: number) => {
    const nextIndex = index + offset;
    if (nextIndex < 0 || nextIndex >= values.length) return;
    const next = [...values];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-gray-700">{label}</label>
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#0284C7] bg-blue-50/40 px-4 py-5 font-bold text-[#0369A1] hover:bg-blue-50">
        {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
        {uploading ? 'جاري رفع وضغط الصور...' : 'إضافة صور من الجهاز'}
        <input type="file" accept="image/*" multiple className="hidden" disabled={uploading} onChange={(event) => { void handleFiles(event.target.files); event.target.value = ''; }} />
      </label>
      {values.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {values.map((url, index) => (
            <div key={`${url}-${index}`} className="group overflow-hidden rounded-xl border bg-white">
              <img loading="lazy" decoding="async" src={url} alt={`صورة ${index + 1}`} className="h-28 w-full object-cover" />
              <div className="flex items-center justify-between gap-1 p-2">
                <GripVertical className="h-4 w-4 text-gray-400" />
                <div className="flex gap-1">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="rounded bg-gray-100 px-2 py-1 text-xs disabled:opacity-30">↑</button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === values.length - 1} className="rounded bg-gray-100 px-2 py-1 text-xs disabled:opacity-30">↓</button>
                  <button type="button" onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} className="rounded bg-red-50 p-1 text-red-600 hover:bg-red-100" title="إزالة الصورة"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
