import { memo, useState, useCallback } from 'react';
import { Image, Upload, Trash2, Edit3 } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { supabase } from '../../lib/supabase';

interface MediaFile {
  id: string;
  name: string;
  url: string;
}

interface MediaLibraryProps {
  mediaFiles: MediaFile[];
  fetchMedia: () => void;
  token: string | null;
}

const MediaLibrary = memo(({ mediaFiles, fetchMedia }: MediaLibraryProps) => {
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const handleUploadMedia = useCallback(async (e: import("react").ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingMedia(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: false
      };
      
      const compressedFile = await imageCompression(file, options);
      
      const fileName = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, compressedFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);
        
      const downloadURL = publicUrlData.publicUrl;

      const { error: dbError } = await supabase
        .from('images')
        .insert({ name: file.name, url: downloadURL });
        
      if (dbError) throw dbError;

      alert('تم ضغط ورفع الصورة بنجاح');
      fetchMedia();
    } catch (error) {
      console.error("Upload error:", error);
      alert('حدث خطأ أثناء رفع الصورة');
    } finally {
      setUploadingMedia(false);
      e.target.value = '';
    }
  }, [fetchMedia]);

  const handleDeleteMedia = useCallback(async (id: string, url: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;
    try {
      // Also delete from storage if it's a Supabase URL
      if (url.includes('supabase.co')) {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        const fileName = pathParts[pathParts.length - 1];
        if (fileName) {
          await supabase.storage.from('media').remove([fileName]);
        }
      }

      const { error } = await supabase.from('images').delete().eq('id', id);
      
      if (error) throw error;
      
      alert('تم حذف الصورة');
      fetchMedia();
    } catch (error) {
      console.error("Delete error:", error);
      alert('حدث خطأ أثناء الحذف');
    }
  }, [fetchMedia]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Image className="w-5 h-5 text-[#0284C7]" />
          مكتبة الوسائط (الصور)
        </h2>
        <div>
          <label className="cursor-pointer bg-[#0284C7] text-white px-4 py-2 rounded-md hover:bg-[#0369A1] transition-colors font-bold inline-flex items-center gap-2">
            <Upload className="w-4 h-4" />
            {uploadingMedia ? 'جاري الرفع...' : 'رفع صورة جديدة'}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleUploadMedia}
              disabled={uploadingMedia}
            />
          </label>
        </div>
      </div>
      
      {mediaFiles.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed border-gray-200 rounded-lg">
          <Image className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">لا توجد صور في مكتبة الوسائط حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaFiles.map((file) => (
            <div key={file.id} className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm aspect-square bg-gray-100 flex items-center justify-center">
              {file.url && typeof file.url === 'string' && file.url.trim() !== '' ? (
                <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-sm">صورة غير صالحة</span>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(file.url);
                    alert('تم نسخ رابط الصورة');
                  }}
                  className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-200"
                  title="نسخ الرابط"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteMedia(file.id, file.url)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  title="حذف الصورة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
MediaLibrary.displayName = 'MediaLibrary';

export default MediaLibrary;
