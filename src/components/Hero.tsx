import { useMemo } from 'react';
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useContent } from '../contexts/ContentContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

const defaultHeroImages = [
  { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=82', alt: 'واجهات زجاجية حديثة', isPrimary: true },
  { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=82', alt: 'حلول زجاج معماري حديثة' }
];

export default function Hero() {
  const { language } = useLanguage();
  const { getContent } = useContent();
  const heroContent = getContent('hero_content');
  const heroImagesContent = getContent('hero_images');
  const siteSettingsContent = getContent('site_settings');

  const settings = useMemo(() => {
    try { return siteSettingsContent?.body ? JSON.parse(siteSettingsContent.body) : {}; } catch { return {}; }
  }, [siteSettingsContent]);

  const heroImages = useMemo(() => {
    if (heroImagesContent?.body) {
      try {
        const parsed = JSON.parse(heroImagesContent.body);
        const filtered = parsed
          .filter((img: any) => !img.isHidden && typeof img.url === 'string' && img.url.trim())
          .sort((a: any, b: any) => Number(!!b.isPrimary) - Number(!!a.isPrimary));
        if (filtered.length) return filtered;
      } catch {}
    }
    return defaultHeroImages;
  }, [heroImagesContent]);

  const whatsapp = String(settings.whatsappNumber || '966510233706').replace(/\D/g, '');
  const active = heroImages[0] || defaultHeroImages[0];
  const title = active.title || (language === 'ar' ? 'أرقى أعمال الزجاج الحديث' : 'Premium Modern Glass');
  const description = active.description || (language === 'ar'
    ? 'حلول زجاجية معمارية راقية للمنازل والمشاريع التجارية في الرياض، تجمع بين الشفافية والدقة والفخامة.'
    : 'Premium architectural glass solutions for homes and commercial projects across Riyadh.');

  return (
    <section className="relative min-h-[88svh] md:min-h-[92vh] overflow-hidden bg-[linear-gradient(135deg,#fbfdff_0%,#eef8fd_54%,#ffffff_100%)] flex items-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-sky-200/35 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[24rem] h-[24rem] rounded-full bg-cyan-100/45 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 md:py-28 relative z-10">
        <div className="grid lg:grid-cols-[0.92fr_1.08fr] gap-8 sm:gap-10 lg:gap-14 items-center">
          <div className="order-2 lg:order-1 text-center lg:text-right opacity-100 visible">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/75 backdrop-blur-xl px-4 py-2 text-xs sm:text-sm font-bold text-sky-800 shadow-sm mb-6">
              <Sparkles className="w-4 h-4" /> {language === 'ar' ? 'حلول زجاجية معمارية في الرياض' : 'Architectural glass solutions in Riyadh'}
            </div>

            {heroContent?.body ? (
              <div className="prose max-w-none prose-h1:text-slate-950 prose-h1:text-4xl prose-h1:sm:text-5xl prose-h1:lg:text-7xl prose-h1:leading-[1.05] prose-h1:tracking-tight prose-p:text-slate-600 prose-p:text-lg prose-p:leading-8" dangerouslySetInnerHTML={{ __html: heroContent.body }} />
            ) : (
              <>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight text-slate-950 mb-6">
                  {title.includes('الزجاج') ? <>{title.split('الزجاج')[0]}<span className="text-sky-600">الزجاج</span>{title.split('الزجاج')[1]}</> : title}
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-8 max-w-2xl mx-auto lg:mx-0 mb-8">{description}</p>
              </>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a href="#services" className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 text-white px-7 py-4 font-black shadow-[0_18px_45px_rgba(2,132,199,.22)] hover:-translate-y-0.5 transition-transform">
                {language === 'ar' ? 'استكشف خدماتنا' : 'Explore services'}
                {language === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
              </a>
              <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('مرحبًا، أريد طلب معاينة لمشروع زجاج')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl text-slate-800 px-7 py-4 font-black hover:border-sky-300 transition-colors">
                {language === 'ar' ? 'اطلب معاينة' : 'Request a visit'}
              </a>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3 max-w-2xl mx-auto lg:mx-0">
              {[
                { icon: ShieldCheck, title: 'جودة وضمان' },
                { icon: MapPin, title: 'معاينة بالرياض' },
                { icon: Sparkles, title: 'تنفيذ احترافي' }
              ].map(({ icon: Icon, title: cardTitle }) => (
                <div key={cardTitle} className="rounded-2xl border border-white/90 bg-white/60 backdrop-blur-2xl px-2 sm:px-4 py-4 shadow-[0_16px_40px_rgba(15,23,42,.08)]">
                  <Icon className="w-5 h-5 text-sky-600 mx-auto lg:mx-0 mb-2" />
                  <div className="text-[11px] sm:text-sm font-black text-slate-800">{cardTitle}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 relative opacity-100 visible">
            <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-white/80 via-sky-100/60 to-white/20 blur-xl" />
            <div className="relative rounded-[2rem] sm:rounded-[2.6rem] overflow-hidden border border-white shadow-[0_35px_90px_rgba(15,23,42,.16)] aspect-[4/5] sm:aspect-[16/13] lg:aspect-[5/6] xl:aspect-[6/5] bg-white group">
              <Swiper modules={[Autoplay, EffectFade, Navigation, Keyboard]} effect="fade" speed={900} autoplay={{ delay: 5200, disableOnInteraction: false }} keyboard={{ enabled: true }} navigation={{ nextEl: '.hero-next', prevEl: '.hero-prev' }} className="w-full h-full">
                {heroImages.map((img: any, index: number) => (
                  <SwiperSlide key={`${img.url}-${index}`}>
                    <img src={img.url} alt={img.alt || img.altText || 'زجاج الرياض'} loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} decoding="async" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-white/10" />
                    {(img.title || img.description) && <div className="absolute bottom-5 right-5 left-5 rounded-2xl border border-white/60 bg-white/68 backdrop-blur-xl p-4 text-right"><div className="font-black text-slate-900">{img.title}</div>{img.description && <div className="text-sm text-slate-600 mt-1 line-clamp-2">{img.description}</div>}</div>}
                  </SwiperSlide>
                ))}
              </Swiper>
              {heroImages.length > 1 && <>
                <button className="hero-next absolute z-20 top-1/2 -translate-y-1/2 right-3 w-10 h-10 rounded-full bg-white/80 backdrop-blur-xl border border-white shadow flex items-center justify-center text-slate-700" aria-label="الصورة التالية"><ChevronRight className="w-5 h-5" /></button>
                <button className="hero-prev absolute z-20 top-1/2 -translate-y-1/2 left-3 w-10 h-10 rounded-full bg-white/80 backdrop-blur-xl border border-white shadow flex items-center justify-center text-slate-700" aria-label="الصورة السابقة"><ChevronLeft className="w-5 h-5" /></button>
              </>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
