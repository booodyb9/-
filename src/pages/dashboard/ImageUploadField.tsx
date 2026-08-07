import { useState } from 'react';
import { ImagePlus, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { deleteDashboardImage, uploadDashboardImage } from '../../lib/mediaUpload';

interface ImageUploadFieldProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  helpText?: string;
}

export default function ImageUploadField({ label, value = '', onChange, folder = 'dashboard', helpText }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleUpload = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const previousUrl = value;
      const uploaded = await uploadDashboardImage(file, folder);
      onChange(uploaded.url);
      if (previousUrl && previousUrl !== uploaded.url) void deleteDashboardImage(previousUrl);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert(error instanceof Error ? error.message : 'تعذر رفع الصورة. حاول مرة أخرى.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!value || removing) return;
    setRemoving(true);
    try {
      await deleteDashboardImage(value);
      onChange('');
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-gray-700">{label}</label>

      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
          <img loading="lazy" decoding="async" src={value} alt={label} className="h-44 w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black/60 p-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-gray-800 hover:bg-gray-100">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              استبدال من الجهاز
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading || removing}
                onChange={(event) => {
                  void handleUpload(event.target.files?.[0]);
                  event.target.value = '';
                }}
              />
            </label>
            <button
              type="button"
              onClick={() => void handleRemove()}
              disabled={uploading || removing}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {removing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              {removing ? 'جاري الحذف...' : 'إزالة'}
            </button>
          </div>
        </div>
      ) : (
        <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#0284C7] bg-blue-50/40 p-5 text-center transition hover:bg-blue-50">
          {uploading ? <Loader2 className="mb-2 h-8 w-8 animate-spin text-[#0284C7]" /> : <ImagePlus className="mb-2 h-8 w-8 text-[#0284C7]" />}
          <span className="font-bold text-gray-800">{uploading ? 'جاري رفع وضغط الصورة...' : 'رفع صورة من الجهاز'}</span>
          <span className="mt-1 text-xs text-gray-500">JPG / PNG / WEBP — يتم ضغط الصورة تلقائيًا</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(event) => {
              void handleUpload(event.target.files?.[0]);
              event.target.value = '';
            }}
          />
        </label>
      )}

      {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
    </div>
  );
}
