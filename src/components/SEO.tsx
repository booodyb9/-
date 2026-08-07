import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../contexts/LanguageContext';
import { useContent } from '../contexts/ContentContext';

interface SEOProps {
  noindex?: boolean;
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  image?: string;
  path?: string;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

interface SiteSettings {
  companyName?: string;
  phoneNumber?: string;
  logoUrl?: string;
  defaultMetaTitle?: string;
  defaultMetaDescription?: string;
  defaultMetaKeywords?: string;
  googleSiteVerification?: string;
  siteDomain?: string;
  address?: string;
  socialLinks?: Record<string, string>;
  twitterUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
}

export default function SEO({ noindex, title, description, keywords, canonical, image, path: requestedPath, structuredData }: SEOProps) {
  const { language } = useLanguage();
  const { getContent } = useContent();
  const location = useLocation();
  const path = requestedPath || location.pathname;
  const settingsContent = getContent('site_settings');

  let siteSettings: SiteSettings = {};
  if (settingsContent?.body) {
    try {
      const parsed = JSON.parse(settingsContent.body);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        siteSettings = parsed as SiteSettings;
      }
    } catch (error) {
      console.error('Invalid site_settings SEO content:', error);
    }
  }

  const defaults = language === 'ar'
    ? {
        title: siteSettings.defaultMetaTitle || 'شركة زجاج الرياض | تركيب زجاج الرياض | واجهات، كبائن شاور، ومرايا',
        description: siteSettings.defaultMetaDescription || 'شركة زجاج الرياض لتركيب وتفصيل الزجاج في الرياض. متخصصون في الواجهات الزجاجية، القواطع المكتبية، كبائن الشاور، المرايا الديكورية وزجاج السيكوريت.',
        keywords: siteSettings.defaultMetaKeywords || 'زجاج الرياض, تركيب زجاج بالرياض, زجاج سيكوريت الرياض, كبائن شاور الرياض, واجهات زجاجية الرياض, قواطع زجاجية, مرايا الرياض',
      }
    : {
        title: 'Riyadh Glass Company | Glass Installation Riyadh',
        description: 'Riyadh Glass Company for glass installation and fabrication in Riyadh, including facades, office partitions, shower cabins, mirrors and tempered glass.',
        keywords: 'Riyadh glass, glass installation Riyadh, tempered glass Riyadh, shower cabins Riyadh, glass facades Riyadh',
      };

  const pageTitle = title || defaults.title;
  const pageDescription = description || defaults.description;
  const pageKeywords = keywords || defaults.keywords;
  const configuredDomain = siteSettings.siteDomain?.trim().replace(/\/$/, '');
  const runtimeOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const baseUrl = configuredDomain || runtimeOrigin || 'https://riyadhglass.com';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${baseUrl}${normalizedPath === '/' ? '' : normalizedPath}`;
  const canonicalUrl = canonical || url;
  const ogImage = image || siteSettings.logoUrl || `${baseUrl}/og-image.jpg`;
  const companyName = siteSettings.companyName || (language === 'ar' ? 'شركة زجاج الرياض' : 'Riyadh Glass Company');

  const pathParts = normalizedPath.split('/').filter(Boolean);
  const breadcrumbList = {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: language === 'ar' ? 'الرئيسية' : 'Home',
        item: baseUrl,
      },
      ...pathParts.map((part, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: decodeURIComponent(part),
        item: `${baseUrl}/${pathParts.slice(0, index + 1).map(encodeURIComponent).join('/')}`,
      })),
    ],
  };

  const socialLinks = siteSettings.socialLinks && typeof siteSettings.socialLinks === 'object'
    ? Object.values(siteSettings.socialLinks).filter((value): value is string => Boolean(value))
    : [siteSettings.twitterUrl, siteSettings.instagramUrl, siteSettings.facebookUrl].filter((value): value is string => Boolean(value));

  const organization: Record<string, unknown> = {
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${baseUrl}/#organization`,
    name: companyName,
    url: baseUrl,
    description: pageDescription,
    areaServed: 'الرياض',
  };

  if (siteSettings.logoUrl) {
    organization.logo = siteSettings.logoUrl;
    organization.image = siteSettings.logoUrl;
  } else if (ogImage) {
    organization.image = ogImage;
  }
  if (siteSettings.phoneNumber) {
    organization.telephone = siteSettings.phoneNumber;
    organization.contactPoint = {
      '@type': 'ContactPoint',
      telephone: siteSettings.phoneNumber,
      contactType: 'customer service',
      availableLanguage: ['Arabic', 'English'],
    };
  }
  if (siteSettings.address) {
    organization.address = {
      '@type': 'PostalAddress',
      streetAddress: siteSettings.address,
      addressLocality: 'الرياض',
      addressRegion: 'منطقة الرياض',
      addressCountry: 'SA',
    };
  }
  if (socialLinks.length > 0) organization.sameAs = socialLinks;

  const graph: Record<string, unknown>[] = [
    organization,
    {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: companyName,
      publisher: { '@id': `${baseUrl}/#organization` },
      inLanguage: language === 'ar' ? 'ar-SA' : 'en-US',
    },
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: pageTitle,
      isPartOf: { '@id': `${baseUrl}/#website` },
      description: pageDescription,
      inLanguage: language === 'ar' ? 'ar-SA' : 'en-US',
      breadcrumb: { '@id': `${url}#breadcrumb` },
    },
    breadcrumbList,
    ...(structuredData ? (Array.isArray(structuredData) ? structuredData : [structuredData]) : []),
  ];

  return (
    <Helmet>
      <html lang={language === 'ar' ? 'ar' : 'en'} dir={language === 'ar' ? 'rtl' : 'ltr'} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {pageKeywords && <meta name="keywords" content={pageKeywords} />}
      <meta name="author" content={companyName} />
      {siteSettings.googleSiteVerification && <meta name="google-site-verification" content={siteSettings.googleSiteVerification} />}
      <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow'} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={companyName} />
      <meta property="og:locale" content={language === 'ar' ? 'ar_SA' : 'en_US'} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImage} />

      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" href={url} hrefLang={language === 'ar' ? 'ar' : 'en'} />
      <link rel="alternate" href={url} hrefLang="x-default" />

      <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>
    </Helmet>
  );
}
