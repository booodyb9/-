import re

with open('src/components/SEO.tsx', 'r') as f:
    content = f.read()

new_local_business = """      {
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
      },"""

# Replace the existing HomeAndConstructionBusiness
content = re.sub(
    r'\{\s*"@type":\s*"HomeAndConstructionBusiness".*?\},(?=\s*\{\s*"@type":\s*"WebSite")',
    new_local_business,
    content,
    flags=re.DOTALL
)

with open('src/components/SEO.tsx', 'w') as f:
    f.write(content)
