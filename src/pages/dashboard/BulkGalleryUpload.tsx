import { useState, useCallback, memo } from 'react';
import { Upload, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { supabase, saveContent } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

import { Content } from './types';
import { useContent } from '../../contexts/ContentContext';

interface BulkGalleryUploadProps {
  token: string | null;
  contents: Content[];
  fetchContents: () => void;
  fetchMedia: () => void;
}

const CATEGORIES = [
  'واجهات زجاجية (Glass Facades)',
  'أبواب زجاجية (Glass Doors)',
  'كبائن شاور (Shower Cabins)',
  'مرايا (Mirrors)',
  'زجاج مكاتب (Office Glass)',
  'درابزين (Railings)',
  'سكني (Residential)',
  'تجاري (Commercial)',
  'أخرى (Other)'
];

const BulkGalleryUpload = memo(({ token, contents, fetchContents, fetchMedia }: BulkGalleryUploadProps) => {
  const { refreshContent, updateContent } = useContent();
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ total: number; current: number; failed: number } | null>(null);

  const handleBulkUpload = useCallback(async (e: import("react").ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (!files.length) return;
    
    if (!confirm(`هل أنت متأكد من رفع ${files.length} صورة إلى قسم "${selectedCategory}"؟`)) {
      e.target.value = '';
      return;
    }
    
    setUploading(true);
    setProgress({ total: files.length, current: 0, failed: 0 });
    
    const newGalleryItems = [];
    let current = 0;
    let failed = 0;
    
    for (const file of files) {
      try {
        const options = { maxWidthOrHeight: 1920, useWebWorker: false };
        const compressedFile = await imageCompression(file, options);
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, compressedFile);
          
        if (uploadError) throw uploadError;
        
        const { data: pubData } = supabase.storage.from('media').getPublicUrl(filePath);
        
        const newImage = { 
          name: file.name,
          url: pubData.publicUrl,
          storage_path: `media/${filePath}`
        };
        
        const { error: insertError } = await supabase.from('media').insert([newImage]);
        if (insertError) console.error("Media insert error:", insertError);
        
        const newId = uuidv4();
        newGalleryItems.push({
          id: newId,
          slug: newId,
          title: file.name.split('.')[0],
          category: selectedCategory,
          description: '',
          location: '',
          serviceType: '',
          client: '',
          completionDate: '',
          materialsUsed: '',
          coverImage: newImage.url,
          galleryImages: [newImage.url],
          isFeatured: true,
          isHidden: false,
          order: Date.now(),
          seoTitle: '',
          seoDescription: ''
        });
        current++;
      } catch (error) {
        console.error("Upload error for file:", file.name, error);
        failed++;
      }
      setProgress({ total: files.length, current, failed });
    }
    
    if (newGalleryItems.length > 0) {
      try {
        const { data: currentContentData } = await supabase.from('contents').select('*').eq('key', 'premium_portfolio_projects').single();
        
                let projects = [];
        if (currentContentData && currentContentData.body) {
           try {
             projects = JSON.parse(currentContentData.body);
             if (!Array.isArray(projects)) projects = [];
           } catch (e) {
             console.error("Failed to parse projects in bulk upload", e);
             projects = [];
           }
        }
        
        projects = [...projects, ...newGalleryItems];
        
        await saveContent('premium_portfolio_projects', 'Premium Portfolio Projects', 'json', JSON.stringify(projects));
        updateContent('premium_portfolio_projects', JSON.stringify(projects));
        fetchMedia();
        refreshContent();
      } catch (error) {
        console.error("Error saving to supabase:", error);
      }
    }
    
    setUploading(false);
    setTimeout(() => setProgress(null), 3000);
    e.target.value = '';
  }, [selectedCategory, fetchMedia]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <ImageIcon className="w-5 h-5 text-[#0284C7]" />
        <h2 className="text-lg font-bold text-gray-900">
          رفع صور متعددة لمعرض الأعمال
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            اختر القسم (الخدمة) للصور المرفوعة:
          </label>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={uploading}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:border-[#0284C7] outline-none"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={`
            inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md font-bold transition-colors cursor-pointer
            ${uploading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#0284C7] text-white hover:bg-[#0369A1]'}
          `}>
            <Upload className="w-5 h-5" />
            {uploading ? 'جاري الرفع...' : 'اختر الصور وقم بالرفع'}
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              className="hidden" 
              onChange={handleBulkUpload}
              disabled={uploading}
            />
          </label>
          <p className="text-sm text-gray-500 mt-2">يمكنك تحديد أكثر من صورة في نفس الوقت.</p>
        </div>

        {progress && (
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-2">
            <div className="flex justify-between text-sm font-bold text-gray-700">
              <span>حالة الرفع:</span>
              <span>{progress.current + progress.failed} / {progress.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-[#0284C7] h-2.5 rounded-full transition-all" 
                style={{ width: `${((progress.current + progress.failed) / progress.total) * 100}%` }}
              ></div>
            </div>
            <div className="flex gap-4 text-sm mt-2">
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" /> تم بنجاح: {progress.current}
              </span>
              {progress.failed > 0 && (
                <span className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="w-4 h-4" /> فشل: {progress.failed}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
BulkGalleryUpload.displayName = 'BulkGalleryUpload';

export default BulkGalleryUpload;
