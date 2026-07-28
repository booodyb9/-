import re

with open('src/components/SEO.tsx', 'r') as f:
    content = f.read()

new_seo_data = """  const defaultStructuredData = {
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
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "طريق الملك فهد",
          "addressLocality": "الرياض",
          "addressRegion": "منطقة الرياض",
          "postalCode": "12211",
          "addressCountry": "SA"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 24.7136,
          "longitude": 46.6753
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Saturday"
          ],
          "opens": "08:00",
          "closes": "22:00"
        },
        "areaServed": "الرياض",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+966510233706",
          "contactType": "customer service"
        }
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
        "inLanguage": "ar-SA"
      }
    ]
  };"""

content = re.sub(r'const defaultStructuredData = {.*?};', new_seo_data, content, flags=re.DOTALL)

with open('src/components/SEO.tsx', 'w') as f:
    f.write(content)
