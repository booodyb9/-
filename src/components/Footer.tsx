import { Link } from "react-router-dom";
import { Building2, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { useMemo } from 'react';

export default function Footer() {
  const { getContent } = useContent();
  
  const footerContent = getContent('footer_content');
  const companyInfoContent = getContent('company_info');
  const socialLinksContent = getContent('social_links');
  const navContent = getContent('navigation_links');
  const servicesContent = getContent('services_items');

  const navLinks = useMemo(() => {
    if (navContent && navContent.body) {
      try {
        const parsed = JSON.parse(navContent.body);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((item: any) => ({ name: item.label, href: item.href }));
        }
      } catch (e) {}
    }
    return [
      { name: 'الرئيسية', href: '/' },
      { name: 'خدماتنا', href: '/services' },
      { name: 'أعمالنا', href: '/portfolio' },
      { name: 'اتصل بنا', href: '/contact' },
    ];
  }, [navContent]);

  const servicesLinks = useMemo(() => {
    if (servicesContent && servicesContent.body) {
      try {
        const parsed = JSON.parse(servicesContent.body);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.slice(0, 4); // Only show top 4 services
        }
      } catch (e) {}
    }
    return [
      { title: 'الواجهات الزجاجية' },
      { title: 'القواطع المكتبية' },
      { title: 'كبائن الشاور' },
      { title: 'الأبواب والنوافذ' },
    ];
  }, [servicesContent]);

  const companyInfo = useMemo(() => {
    if (companyInfoContent?.body) {
      try {
        const parsed = JSON.parse(companyInfoContent.body);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [];
  }, [companyInfoContent]);

  const socialLinks = useMemo(() => {
    if (socialLinksContent?.body) {
      try {
        const parsed = JSON.parse(socialLinksContent.body);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [];
  }, [socialLinksContent]);
  
  const getIcon = (name: string) => {
    switch(name?.toLowerCase()) {
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'linkedin': return <Linkedin className="w-5 h-5" />;
      case 'youtube': return <Youtube className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <footer className="bg-[#0F172A] text-gray-400 py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          <div className="col-span-1 md:col-span-12 lg:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-6 w-6 text-[#0284C7]" />
              <span className="font-bold text-xl text-white">شركة زجاج الرياض</span>
            </div>
            {footerContent?.body ? <div className="text-sm leading-relaxed max-w-sm mb-6 prose prose-invert prose-p:text-gray-400" dangerouslySetInnerHTML={{ __html: footerContent.body }} /> : <p className="text-sm leading-relaxed max-w-sm mb-6">شركتك الموثوقة لجميع أعمال وتوريدات الزجاج في مدينة الرياض. نقدم الجودة والإتقان بأسعار تنافسية تلبي احتياجات مشاريعكم السكنية والتجارية.</p>}
          </div>
          
          <div className="col-span-1 md:col-span-4 lg:col-span-2">
            <h4 className="text-white font-bold tracking-widest uppercase text-sm mb-6">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              {navLinks.map((link, idx) => (
                <li key={idx}><Link to={link.href} className="hover:text-[#0284C7] transition-colors">{link.name}</Link></li>
              ))}
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-4 lg:col-span-3">
            <h4 className="text-white font-bold tracking-widest uppercase text-sm mb-6">خدماتنا</h4>
            <ul className="space-y-2 text-sm">
              {servicesLinks.map((service: any, idx: number) => {
                const slug = service.title.replace(/\s+/g, '-').toLowerCase();
                return (
                  <li key={idx}><Link to={`/services/${slug}`} className="hover:text-[#0284C7] transition-colors">{service.title}</Link></li>
                );
              })}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-4 lg:col-span-3">
            <h4 className="text-white font-bold tracking-widest uppercase text-sm mb-6">نطاق التغطية</h4>
            <div className="rounded-sm overflow-hidden border border-gray-800 relative h-32 group block bg-gray-900">
              <a href="https://maps.google.com/maps?q=Riyadh&t=&z=10" target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                <iframe 
                  src="https://maps.google.com/maps?q=Riyadh&t=&z=10&ie=UTF8&iwloc=&output=embed" 
                  className="w-full h-full pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{ border: 0 }} 
                  loading="lazy"
                  title="خريطة الرياض"
                ></iframe>
                <div className="absolute inset-0 bg-[#0284C7]/10 group-hover:bg-transparent transition-colors flex items-center justify-center">
                  <div className="bg-[#0F172A]/90 text-white text-xs font-bold px-4 py-2 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity border border-[#0284C7]/30 shadow-lg">
                    عرض على خرائط جوجل
                  </div>
                </div>
              </a>
            </div>
            <p className="text-xs mt-3 text-gray-500">نغطي جميع أحياء مدينة الرياض وضواحيها</p>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-sm text-center md:text-right flex flex-col md:flex-row justify-between items-center gap-4">
          <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} شركة زجاج الرياض</p>
          <div className="flex gap-4">
            <span>الرياض، المملكة العربية السعودية</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
