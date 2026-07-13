import { memo, useState, useCallback } from 'react';
import { Image, Upload, Trash2, Edit3 } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface MediaFile {
  id: number;
  name: string;
  url: string;
}

interface MediaLibraryProps {
  mediaFiles: MediaFile[];
  fetchMedia: () => void;
  token: string | null;
}

const MediaLibrary = memo(({ mediaFiles, fetchMedia, token }: MediaLibraryProps) => {
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const handleUploadMedia = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      
      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
      
      const response = await fetch('/api/admin/images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: file.name,
          url: base64
        })
      });

      if (response.ok) {
        alert('تم ضغط ورفع الصورة بنجاح');
        fetchMedia();
      } else {
        alert('حدث خطأ أثناء رفع الصورة');
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert('حدث خطأ أثناء رفع الصورة');
    } finally {
      setUploadingMedia(false);
    }
  }, [fetchMedia, token]);

  const handleDeleteMedia = useCallback(async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;
    try {
      const response = await fetch(`/api/admin/images/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        alert('تم حذف الصورة');
        fetchMedia();
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert('حدث خطأ أثناء الحذف');
    }
  }, [fetchMedia, token]);

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
            <div key={file.id} className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm aspect-square bg-gray-100">
              <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
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
                  onClick={() => handleDeleteMedia(file.id)}
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
