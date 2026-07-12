import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../contexts/LanguageContext';

export default function SEO() {
  const { language } = useLanguage();

  const seoData = {
    ar: {
      title: 'تركيب زجاج الرياض | روائع الزجاج للواجهات والشاور والمرايا',
      description: 'أفضل شركة لتركيب وتفصيل الزجاج في الرياض. متخصصون في الواجهات الزجاجية (ستركشر)، القواطع المكتبية، كبائن الشاور، المرايا الديكورية، وزجاج السيكوريت بأسعار منافسة وجودة عالية.',
      keywords: 'زجاج الرياض, تركيب زجاج بالرياض, محلات زجاج في الرياض, مصنع زجاج الرياض, زجاج سيكوريت الرياض, تفصيل زجاج بالرياض, كبائن شاور الرياض, واجهات زجاجية الرياض, قواطع زجاجية للمكاتب, مرايا ديكور الرياض, أبواب زجاجية',
    },
    en: {
      title: 'Glass Installation Riyadh | Rawae Glass Facades & Partitions',
      description: 'Top glass installation and fabrication company in Riyadh. We specialize in structural glass facades, office partitions, shower cabins, decorative mirrors, and tempered glass with high quality and competitive prices.',
      keywords: 'glass Riyadh, glass installation Riyadh, glass shops in Riyadh, glass factory Riyadh, tempered glass Riyadh, custom glass Riyadh, shower cabins Riyadh, glass facades Riyadh, office glass partitions, decorative mirrors Riyadh',
    }
  };

  const data = seoData[language];
  const url = 'https://sites.google.com/view/zugag-riyadh';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{data.title}</title>
      <meta name="description" content={data.description} />
      <meta name="keywords" content={data.keywords} />
      <meta name="author" content={language === 'ar' ? 'روائع الزجاج' : 'Rawae Glass'} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={data.title} />
      <meta property="og:description" content={data.description} />
      <meta property="og:image" content={`${url}/og-image.jpg`} />
      <meta property="og:site_name" content={language === 'ar' ? 'روائع الزجاج' : 'Rawae Glass'} />
      <meta property="og:locale" content={language === 'ar' ? 'ar_SA' : 'en_US'} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={data.title} />
      <meta name="twitter:description" content={data.description} />
      <meta name="twitter:image" content={`${url}/og-image.jpg`} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={url} />

      {/* Language Alternates */}
      <link rel="alternate" href={url} hrefLang="ar" />
      <link rel="alternate" href={url} hrefLang="en" />
      <link rel="alternate" href={url} hrefLang="x-default" />
    </Helmet>
  );
}
