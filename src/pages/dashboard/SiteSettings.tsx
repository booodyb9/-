import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import type { Content } from './types';
import { saveContent, supabase } from '../../lib/supabase';
import { useContent } from '../../contexts/ContentContext';

interface Props {
  contents: Content[];
  fetchContents: () => void | Promise<void>;
}

interface SiteSettingsState {
  companyName: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  phoneNumber: string;
  email: string;
  address: string;
  workingHours: string;
  mapsEmbedUrl: string;
  logoUrl: string;
  faviconUrl: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  defaultMetaKeywords: string;
  googleSiteVerification: string;
  siteDomain: string;
  twitterUrl: string;
  instagramUrl: string;
  facebookUrl: string;
}

const EMPTY_SETTINGS: SiteSettingsState = {
  companyName: 'شركة زجاج الرياض',
  whatsappNumber: '',
  whatsappDefaultMessage: '',
  phoneNumber: '',
  email: '',
  address: '',
  workingHours: '',
  mapsEmbedUrl: '',
  logoUrl: '',
  faviconUrl: '',
  defaultMetaTitle: '',
  defaultMetaDescription: '',
  defaultMetaKeywords: '',
  googleSiteVerification: '',
  siteDomain: '',
  twitterUrl: '',
  instagramUrl: '',
  facebookUrl: '',
};

export default function SiteSettings({ contents, fetchContents }: Props) {
  const { updateContent } = useContent();
  const [settings, setSettings] = useState<SiteSettingsState>(EMPTY_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      const legacyContent = contents.find((content) => content.key === 'site_settings');
      let legacy: Record<string, unknown> = {};

      if (legacyContent?.body) {
        try {
          const parsed = JSON.parse(legacyContent.body);
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) legacy = parsed;
        } catch (error) {
          console.error('Invalid legacy site settings JSON:', error);
        }
      }

      const { data, error } = await supabase
        .from('site_settings')
        .select('phone,whatsapp_number,whatsapp_default_message,email,address,working_hours,maps_embed_url,seo_default_title,seo_default_description,seo_default_keywords,google_site_verification,site_domain,social_links')
        .eq('id', 1)
        .maybeSingle();

      if (!active) return;
      if (error) console.error('Unable to load site_settings table:', error);

      const socialLinks = data?.social_links && typeof data.social_links === 'object'
        ? (data.social_links as Record<string, string>)
        : {};

      setSettings({
        companyName: String(legacy.companyName ?? EMPTY_SETTINGS.companyName),
        whatsappNumber: data?.whatsapp_number ?? String(legacy.whatsappNumber ?? ''),
        whatsappDefaultMessage: data?.whatsapp_default_message ?? String(legacy.whatsappDefaultMessage ?? ''),
        phoneNumber: data?.phone ?? String(legacy.phoneNumber ?? ''),
        email: data?.email ?? String(legacy.email ?? ''),
        address: data?.address ?? String(legacy.address ?? ''),
        workingHours: data?.working_hours ?? String(legacy.workingHours ?? ''),
        mapsEmbedUrl: data?.maps_embed_url ?? String(legacy.mapsEmbedUrl ?? ''),
        logoUrl: String(legacy.logoUrl ?? ''),
        faviconUrl: String(legacy.faviconUrl ?? ''),
        defaultMetaTitle: data?.seo_default_title ?? String(legacy.defaultMetaTitle ?? ''),
        defaultMetaDescription: data?.seo_default_description ?? String(legacy.defaultMetaDescription ?? ''),
        defaultMetaKeywords: data?.seo_default_keywords ?? String(legacy.defaultMetaKeywords ?? ''),
        googleSiteVerification: data?.google_site_verification ?? String(legacy.googleSiteVerification ?? ''),
        siteDomain: data?.site_domain ?? String(legacy.siteDomain ?? ''),
        twitterUrl: socialLinks.twitter ?? String(legacy.twitterUrl ?? ''),
        instagramUrl: socialLinks.instagram ?? String(legacy.instagramUrl ?? ''),
        facebookUrl: socialLinks.facebook ?? String(legacy.facebookUrl ?? ''),
      });
      setLoading(false);
    };

    void loadSettings();
    return () => {
      active = false;
    };
  }, [contents]);

  const handleChange = (key: keyof SiteSettingsState, value: string) => {
    setSettings((previous) => ({ ...previous, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const normalizedDomain = settings.siteDomain.trim().replace(/\/$/, '');
      if (normalizedDomain && !/^https?:\/\//i.test(normalizedDomain)) {
        throw new Error('Site domain must start with http:// or https://');
      }

      const socialLinks = {
        twitter: settings.twitterUrl.trim(),
        instagram: settings.instagramUrl.trim(),
        facebook: settings.facebookUrl.trim(),
      };

      const { error: tableError } = await supabase
        .from('site_settings')
        .update({
          phone: settings.phoneNumber.trim(),
          whatsapp_number: settings.whatsappNumber.trim(),
          whatsapp_default_message: settings.whatsappDefaultMessage.trim(),
          email: settings.email.trim(),
          address: settings.address.trim(),
          working_hours: settings.workingHours.trim(),
          maps_embed_url: settings.mapsEmbedUrl.trim() || null,
          seo_default_title: settings.defaultMetaTitle.trim(),
          seo_default_description: settings.defaultMetaDescription.trim(),
          seo_default_keywords: settings.defaultMetaKeywords.trim(),
          google_site_verification: settings.googleSiteVerification.trim() || null,
          site_domain: normalizedDomain,
          social_links: socialLinks,
          updated_at: new Date().toISOString(),
        })
        .eq('id', 1);

      if (tableError) throw tableError;

      const legacySettings = {
        ...settings,
        siteDomain: normalizedDomain,
        socialLinks,
      };
      const serialized = JSON.stringify(legacySettings);
      await saveContent('site_settings', 'Site Settings', 'json', serialized);
      updateContent('site_settings', serialized);
      await fetchContents();
      alert('تم حفظ وربط إعدادات الموقع بنجاح');
    } catch (error) {
      console.error('Unable to save site settings:', error);
      alert('حدث خطأ أثناء حفظ الإعدادات. تحقق من القيم وحاول مرة أخرى.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">جاري تحميل الإعدادات...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" dir="rtl">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between sm:items-center bg-gray-50/50">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">إعدادات الموقع</h2>
          <p className="text-sm text-gray-500 mt-1">هذه القيم تُحفظ في جدول Supabase وتُزامن مع إعدادات الواجهة الحالية.</p>
        </div>
        <button onClick={() => void handleSave()} disabled={saving} className="bg-[#0284C7] text-white px-6 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#0369A1] transition-colors disabled:opacity-50">
          <Save className="w-5 h-5" />
          {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2">معلومات الشركة</h3>
          <Field label="اسم الشركة" value={settings.companyName} onChange={(value) => handleChange('companyName', value)} />
          <Field label="رقم الهاتف" value={settings.phoneNumber} onChange={(value) => handleChange('phoneNumber', value)} dir="ltr" />
          <Field label="رقم واتساب" value={settings.whatsappNumber} onChange={(value) => handleChange('whatsappNumber', value)} dir="ltr" />
          <Field label="رسالة واتساب الافتراضية" value={settings.whatsappDefaultMessage} onChange={(value) => handleChange('whatsappDefaultMessage', value)} />
          <Field label="البريد الإلكتروني" type="email" value={settings.email} onChange={(value) => handleChange('email', value)} dir="ltr" />
          <Field label="العنوان" value={settings.address} onChange={(value) => handleChange('address', value)} />
          <Field label="ساعات العمل" value={settings.workingHours} onChange={(value) => handleChange('workingHours', value)} />
          <Field label="رابط Google Maps Embed" value={settings.mapsEmbedUrl} onChange={(value) => handleChange('mapsEmbedUrl', value)} dir="ltr" />
        </div>

        <div className="space-y-5">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2">SEO والهوية</h3>
          <Field label="الدومين الأساسي" value={settings.siteDomain} onChange={(value) => handleChange('siteDomain', value)} placeholder="https://example.com" dir="ltr" />
          <Field label="الشعار الرئيسي" value={settings.logoUrl} onChange={(value) => handleChange('logoUrl', value)} dir="ltr" />
          <Field label="Favicon" value={settings.faviconUrl} onChange={(value) => handleChange('faviconUrl', value)} dir="ltr" />
          <Field label="Meta Title الافتراضي" value={settings.defaultMetaTitle} onChange={(value) => handleChange('defaultMetaTitle', value)} />
          <TextArea label="Meta Description الافتراضي" value={settings.defaultMetaDescription} onChange={(value) => handleChange('defaultMetaDescription', value)} />
          <TextArea label="الكلمات المفتاحية الافتراضية" value={settings.defaultMetaKeywords} onChange={(value) => handleChange('defaultMetaKeywords', value)} />
          <Field label="Google Site Verification" value={settings.googleSiteVerification} onChange={(value) => handleChange('googleSiteVerification', value)} dir="ltr" />
          <Field label="X / Twitter" value={settings.twitterUrl} onChange={(value) => handleChange('twitterUrl', value)} dir="ltr" />
          <Field label="Instagram" value={settings.instagramUrl} onChange={(value) => handleChange('instagramUrl', value)} dir="ltr" />
          <Field label="Facebook" value={settings.facebookUrl} onChange={(value) => handleChange('facebookUrl', value)} dir="ltr" />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder, dir }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; dir?: 'ltr' | 'rtl' }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} dir={dir} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0284C7] outline-none" />
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0284C7] outline-none h-24 resize-y" />
    </div>
  );
}
