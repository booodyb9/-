import re

with open('src/pages/public/ServicesPage.tsx', 'r') as f:
    content = f.read()

import_useContent = "import { useContent } from '../../contexts/ContentContext';\n"
if "import { useContent" not in content:
    content = content.replace("import Maintenance", import_useContent + "import Maintenance")

target = """export default function ServicesPage() {
  return (
    <>
      <SEO title="خدماتنا | شركة زجاج الرياض" description="جميع خدمات تركيب الواجهات والقواطع الزجاجية." />"""

new_func = """export default function ServicesPage() {
  const { getContent } = useContent();
  const itemsContent = getContent('services_items');
  
  let services: any[] = [];
  if (itemsContent?.body) {
    try {
      const parsed = JSON.parse(itemsContent.body);
      if (Array.isArray(parsed)) services = parsed;
    } catch (e) {}
  }

  const structuredData = {
    "@type": "ItemList",
    "itemListElement": services.map((service, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": service.title,
        "description": service.description,
        "url": `https://riyadh-glass.ai.studio/services/${service.title ? service.title.replace(/\\s+/g, '-').toLowerCase() : ''}`,
        "provider": {
          "@type": "HomeAndConstructionBusiness",
          "name": "شركة زجاج الرياض"
        }
      }
    }))
  };

  return (
    <>
      <SEO 
        title="خدماتنا | شركة زجاج الرياض" 
        description="جميع خدمات تركيب الواجهات والقواطع الزجاجية." 
        structuredData={services.length > 0 ? structuredData : undefined}
      />"""

content = content.replace(target, new_func)

with open('src/pages/public/ServicesPage.tsx', 'w') as f:
    f.write(content)
