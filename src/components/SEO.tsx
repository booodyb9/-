import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../contexts/LanguageContext';
import { useContent } from '../contexts/ContentContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  path?: string;
  structuredData?: any;
}

export default function SEO({ title, description, keywords, image, structuredData }: SEOProps) {
  const { language } = useLanguage();
  const { getContent } = useContent();
  const location = useLocation();
  const path = location.pathname;
  const settingsContent = getContent('site_settings');
  
  let siteSettings: any = {};
  if (settingsContent?.body) {
    try {
      siteSettings = JSON.parse(settingsContent.body);
    } catch(e) {}
  }
  
  const defaultSeoData = {
    ar: {
      title: siteSettings.defaultMetaTitle || 'شركة زجاج الرياض | تركيب زجاج الرياض | واجهات، كبائن شاور، ومرايا',
      description: siteSettings.defaultMetaDescription || 'شركة زجاج الرياض لتركيب وتفصيل الزجاج في الرياض. متخصصون في الواجهات الزجاجية (ستركشر)، القواطع المكتبية، كبائن الشاور، المرايا الديكورية، وزجاج السيكوريت بأسعار منافسة وجودة عالية.',
      keywords: 'زجاج الرياض, شركة زجاج الرياض, تركيب زجاج بالرياض, محلات زجاج في الرياض, مصنع زجاج الرياض, زجاج سيكوريت الرياض, تفصيل زجاج بالرياض, كبائن شاور الرياض, واجهات زجاجية الرياض, قواطع زجاجية للمكاتب, مرايا ديكور الرياض, أبواب زجاجية',
    },
    en: {
      title: 'Riyadh Glass Company | Glass Installation Riyadh | Facades & Partitions',
      description: 'Riyadh Glass Company for glass installation and fabrication in Riyadh. We specialize in structural glass facades, office partitions, shower cabins, decorative mirrors, and tempered glass with high quality and competitive prices.',
      keywords: 'Riyadh Glass Company, glass Riyadh, glass installation Riyadh, glass shops in Riyadh, glass factory Riyadh, tempered glass Riyadh, custom glass Riyadh, shower cabins Riyadh, glass facades Riyadh, office glass partitions, decorative mirrors Riyadh',
    }
  };

  
  const defaultData = defaultSeoData[language];
  const pageTitle = title ? `${title}` : defaultData.title;
  const pageDescription = description || defaultData.description;
  const pageKeywords = keywords || defaultData.keywords;
  
  // Update domain here if needed
  const baseUrl = 'https://riyadh-glass.ai.studio';
  const url = `${baseUrl}${path}`;
  const ogImage = image || `${baseUrl}/og-image.jpg`;

  const pathParts = path.split('/').filter(p => p);
  const breadcrumbList = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": language === 'ar' ? 'الرئيسية' : 'Home',
        "item": baseUrl
      },
      ...pathParts.map((part, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": decodeURIComponent(part),
        "item": `${baseUrl}/${pathParts.slice(0, index + 1).join('/')}`
      }))
    ]
  };


    const defaultStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
            {
        "@type": "HomeAndConstructionBusiness",
        "@id": `${baseUrl}/#organization`,
        "name": siteSettings.companyName || "شركة زجاج الرياض",
        "url": baseUrl,
        "logo": siteSettings.logoUrl || ogImage,
        "image": siteSettings.logoUrl || ogImage,
        "description": pageDescription,
        "telephone": siteSettings.phoneNumber || "+966510233706",
        "priceRange": siteSettings.priceRange || "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": siteSettings.streetAddress || "طريق الملك فهد",
          "addressLocality": siteSettings.addressLocality || "الرياض",
          "addressRegion": siteSettings.addressRegion || "منطقة الرياض",
          "postalCode": siteSettings.postalCode || "12211",
          "addressCountry": "SA"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": siteSettings.latitude || 24.7136,
          "longitude": siteSettings.longitude || 46.6753
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": siteSettings.openingDays || [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Saturday"
          ],
          "opens": siteSettings.opensAt || "08:00",
          "closes": siteSettings.closesAt || "22:00"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": siteSettings.ratingValue || "5.0",
          "reviewCount": siteSettings.reviewCount || "150"
        },
        "areaServed": siteSettings.areaServed || "الرياض",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": siteSettings.phoneNumber || "+966510233706",
          "contactType": "customer service",
          "availableLanguage": ["Arabic", "English"]
        },
        "sameAs": siteSettings.socialLinks ? Object.values(siteSettings.socialLinks).filter(Boolean) : [
          "https://twitter.com/riyadhglass",
          "https://facebook.com/riyadhglass",
          "https://instagram.com/riyadhglass"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl,
        "name": siteSettings.companyName || "شركة زجاج الرياض",
        "publisher": {
          "@id": `${baseUrl}/#organization`
        },
        "inLanguage": "ar-SA"
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        "url": url,
        "name": pageTitle,
        "isPartOf": {
          "@id": `${baseUrl}/#website`
        },
        "description": pageDescription,
        "inLanguage": "ar-SA",
        "breadcrumb": { "@id": `${url}#breadcrumb` }
      },
      breadcrumbList
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="author" content={language === 'ar' ? 'شركة زجاج الرياض' : 'Riyadh Glass Company'} />

      {/* Google Search Console Verification */}
      <meta name="google-site-verification" content="fDAXcSUws--VipnkqaDbj574LpBOVvs-jTNC4wZQW7w" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={language === 'ar' ? 'شركة زجاج الرياض' : 'Riyadh Glass Company'} />
      <meta property="og:locale" content={language === 'ar' ? 'ar_SA' : 'en_US'} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={url} />

      {/* Language Alternates */}
      <link rel="alternate" href={url} hrefLang="ar" />
      <link rel="alternate" href={url} hrefLang="en" />
      <link rel="alternate" href={url} hrefLang="x-default" />

      
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            ...(defaultStructuredData["@graph"] as any[]),
            ...(structuredData ? (Array.isArray(structuredData) ? structuredData : [structuredData]) : [])
          ]
        })}
      </script>

    </Helmet>
  );
}
