import React, { useState, useEffect } from 'react';
import { Content } from './types';
import { Save, Upload, Volume2, Image as ImageIcon, Play, Pause } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { saveContent, supabase } from '../../lib/supabase';
import { useContent } from '../../contexts/ContentContext';

interface Props { contents: Content[]; fetchContents: () => void; }

export default function SiteSettings({ contents, fetchContents }: Props) {
  const { updateContent } = useContent();
  const [settings, setSettings] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<'logo' | 'audio' | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const siteSettings = contents.find(c => c.key === 'site_settings');
    if (siteSettings?.body) { try { setSettings(JSON.parse(siteSettings.body)); } catch {} }
  }, [contents]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = JSON.stringify(settings);
      await saveContent('site_settings', 'Site Settings', 'json', body);
      updateContent('site_settings', body);
      await Promise.resolve(fetchContents());
      alert('تم حفظ الإعدادات بنجاح');
    } catch { alert('حدث خطأ أثناء الحفظ'); }
    finally { setSaving(false); }
  };

  const handleChange = (key: string, value: any) => setSettings((prev: any) => ({ ...prev, [key]: value }));

  const uploadAsset = async (file: File | undefined, kind: 'logo' | 'audio') => {
    if (!file) return;
    const isAudio = kind === 'audio';
    if (isAudio && !file.type.startsWith('audio/')) return alert('اختر ملف صوت صالح.');
    if (!isAudio && !file.type.startsWith('image/')) return alert('اختر صورة صالحة.');
    if (file.size > (isAudio ? 8 : 5) * 1024 * 1024) return alert(`حجم الملف كبير. الحد ${isAudio ? '8MB' : '5MB'}.`);
    setUploading(kind);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || (isAudio ? 'mp3' : 'webp');
      const fileName = `site/${kind}-${uuidv4()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('media').upload(fileName, file, { upsert: false, contentType: file.type });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('media').getPublicUrl(fileName);
      await supabase.from('media').insert({ name: file.name, url: data.publicUrl, storage_path: `media/${fileName}`, type: isAudio ? 'audio' : 'image', size: file.size });
      handleChange(isAudio ? 'introAudioUrl' : 'introLogoUrl', data.publicUrl);
    } catch (e) { console.error(e); alert('فشل رفع الملف.'); }
    finally { setUploading(null); }
  };

  const previewAudio = () => {
    const audio = document.getElementById('intro-audio-preview') as HTMLAudioElement | null;
    if (!audio) return;
    if (audio.paused) { audio.play().catch(() => undefined); setPlaying(true); }
    else { audio.pause(); setPlaying(false); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-3 justify-between sm:items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-[#0F172A]">إعدادات الموقع</h2>
          <button onClick={handleSave} disabled={saving} className="bg-[#0284C7] text-white px-6 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#0369A1] disabled:opacity-50"><Save className="w-5 h-5" />{saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}</button>
        </div>
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">معلومات الشركة</h3>
            <Field label="اسم الشركة" value={settings.companyName || ''} onChange={(v) => handleChange('companyName', v)} />
            <Field label="رقم الجوال (للواتساب)" value={settings.whatsappNumber || ''} onChange={(v) => handleChange('whatsappNumber', v)} dir="ltr" />
            <Field label="رقم الهاتف الأساسي" value={settings.phoneNumber || ''} onChange={(v) => handleChange('phoneNumber', v)} dir="ltr" />
            <Field label="البريد الإلكتروني" value={settings.email || ''} onChange={(v) => handleChange('email', v)} dir="ltr" />
            <Field label="العنوان" value={settings.address || ''} onChange={(v) => handleChange('address', v)} />
          </div>
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">SEO والشعارات</h3>
            <Field label="الشعار الرئيسي (رابط الصورة)" value={settings.logoUrl || ''} onChange={(v) => handleChange('logoUrl', v)} dir="ltr" />
            <Field label="أيقونة الموقع Favicon" value={settings.faviconUrl || ''} onChange={(v) => handleChange('faviconUrl', v)} dir="ltr" />
            <Field label="Meta Title" value={settings.defaultMetaTitle || ''} onChange={(v) => handleChange('defaultMetaTitle', v)} />
            <div><label className="block text-sm font-bold text-gray-700 mb-2">Meta Description</label><textarea value={settings.defaultMetaDescription || ''} onChange={(e) => handleChange('defaultMetaDescription', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0284C7] h-24" /></div>
            <Field label="رابط تويتر/X" value={settings.twitterUrl || ''} onChange={(v) => handleChange('twitterUrl', v)} dir="ltr" />
            <Field label="رابط انستقرام" value={settings.instagramUrl || ''} onChange={(v) => handleChange('instagramUrl', v)} dir="ltr" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b bg-sky-50/60"><h3 className="text-lg font-black text-slate-900">مقدمة العلامة التجارية (Intro)</h3><p className="text-sm text-slate-500 mt-1">إدارة الشعار والصوت والنص بدون تعديل الكود.</p></div>
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <label className="flex items-center gap-3 font-bold"><input type="checkbox" checked={settings.introEnabled !== false} onChange={(e) => handleChange('introEnabled', e.target.checked)} /> تشغيل المقدمة</label>
            <label className="flex items-center gap-3 font-bold"><input type="checkbox" checked={settings.introSoundEnabled !== false} onChange={(e) => handleChange('introSoundEnabled', e.target.checked)} /> تشغيل التعليق الصوتي</label>
            <Field label="النص الظاهر" value={settings.introText || 'زجاج الرياض'} onChange={(v) => handleChange('introText', v)} />
            <div><label className="block text-sm font-bold text-gray-700 mb-2">مدة المقدمة بالثواني (1.2 - 4)</label><input type="number" min="1.2" max="4" step="0.1" value={settings.introDuration || 2.2} onChange={(e) => handleChange('introDuration', Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg" /></div>
          </div>
          <div className="space-y-5">
            <div><label className="block text-sm font-bold text-gray-700 mb-2">شعار المقدمة</label><label className="min-h-28 border-2 border-dashed border-sky-300 rounded-xl bg-sky-50/40 flex flex-col items-center justify-center cursor-pointer"><ImageIcon className="w-7 h-7 text-sky-600 mb-2"/><span className="font-bold text-sm">{uploading === 'logo' ? 'جاري الرفع...' : 'رفع/تغيير الشعار من الجهاز'}</span><input type="file" accept="image/*" className="hidden" onChange={(e) => uploadAsset(e.target.files?.[0], 'logo')} /></label>{settings.introLogoUrl && <img src={settings.introLogoUrl} alt="شعار المقدمة" className="mt-3 w-24 h-24 object-contain rounded-xl border bg-white p-2" />}</div>
            <div><label className="block text-sm font-bold text-gray-700 mb-2">ملف التعليق الصوتي</label><label className="min-h-24 border-2 border-dashed border-sky-300 rounded-xl bg-sky-50/40 flex flex-col items-center justify-center cursor-pointer"><Upload className="w-6 h-6 text-sky-600 mb-2"/><span className="font-bold text-sm">{uploading === 'audio' ? 'جاري الرفع...' : 'رفع/تغيير ملف الصوت'}</span><input type="file" accept="audio/*" className="hidden" onChange={(e) => uploadAsset(e.target.files?.[0], 'audio')} /></label>{settings.introAudioUrl && <div className="mt-3 flex items-center gap-3"><audio id="intro-audio-preview" src={settings.introAudioUrl} onEnded={() => setPlaying(false)} preload="metadata"/><button onClick={previewAudio} className="inline-flex items-center gap-2 border rounded-lg px-4 py-2 font-bold text-sm">{playing ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>} معاينة الصوت</button><Volume2 className="w-4 h-4 text-sky-600" /></div>}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, dir }: { label: string; value: string; onChange: (value: string) => void; dir?: 'ltr' | 'rtl' }) {
  return <div><label className="block text-sm font-bold text-gray-700 mb-2">{label}</label><input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0284C7]" dir={dir || 'auto'} /></div>;
}
