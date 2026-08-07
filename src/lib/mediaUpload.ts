import imageCompression from 'browser-image-compression';
import { supabase } from './supabase';

export interface UploadedMedia {
  url: string;
  storagePath: string;
  name: string;
}

const sanitizeFolder = (folder: string) => folder.replace(/[^a-zA-Z0-9/_-]/g, '').replace(/^\/+|\/+$/g, '') || 'dashboard';

export async function uploadDashboardImage(file: File, folder = 'dashboard'): Promise<UploadedMedia> {
  if (!file.type.startsWith('image/')) {
    throw new Error('يرجى اختيار ملف صورة صالح.');
  }

  const compressed = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    initialQuality: 0.86,
  });

  const originalExt = file.name.split('.').pop()?.toLowerCase();
  const mimeExt = compressed.type.split('/').pop()?.replace('jpeg', 'jpg');
  const extension = (originalExt || mimeExt || 'webp').replace(/[^a-z0-9]/g, '') || 'webp';
  const storagePath = `${sanitizeFolder(folder)}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(storagePath, compressed, {
      upsert: false,
      contentType: compressed.type || file.type || undefined,
      cacheControl: '31536000',
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('media').getPublicUrl(storagePath);
  const mediaRow = {
    name: file.name,
    url: data.publicUrl,
    storage_path: `media/${storagePath}`,
  };

  const { error: insertError } = await supabase.from('media').insert([mediaRow]);
  if (insertError) {
    await supabase.storage.from('media').remove([storagePath]);
    throw insertError;
  }

  return {
    url: data.publicUrl,
    storagePath,
    name: file.name,
  };
}
