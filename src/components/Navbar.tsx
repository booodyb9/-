import { Building2, Phone, Menu, X, Search, Globe, Calendar, CalendarDays, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

const searchDataAr = [
  { title: 'الواجهات الزجاجية', category: 'الخدمات', href: '#services' },
  { title: 'القواطع المكتبية', category: 'الخدمات', href: '#services' },
  { title: 'كبائن الشاور', category: 'الخدمات', href: '#services' },
  { title: 'الأبواب والنوافذ', category: 'الخدمات', href: '#services' },
  { title: 'درابزين زجاجي', category: 'الخدمات', href: '#services' },
  { title: 'مرايا ديكورية وذكية', category: 'الخدمات', href: '#services' },
  { title: 'معرض المشاريع والأعمال', category: 'أعمالنا', href: '#gallery' },
  { title: 'الأسئلة الشائعة', category: 'معلومات', href: '#faq' },
  { title: 'دليل العناية بالزجاج وصيانته', category: 'صيانة', href: '#maintenance' },
  { title: 'طرق تنظيف الزجاج المقسى (السيكوريت)', category: 'صيانة', href: '#maintenance' },
  { title: 'تواصل معنا لطلب تسعيرة', category: 'تواصل', href: '#contact' },
];

const searchDataEn = [
  { title: 'Glass Facades', category: 'Services', href: '#services' },
  { title: 'Office Partitions', category: 'Services', href: '#services' },
  { title: 'Shower Cabins', category: 'Services', href: '#services' },
  { title: 'Doors & Windows', category: 'Services', href: '#services' },
  { title: 'Glass Balustrades', category: 'Services', href: '#services' },
  { title: 'Decorative Mirrors', category: 'Services', href: '#services' },
  { title: 'Projects Gallery', category: 'Gallery', href: '#gallery' },
  { title: 'Frequently Asked Questions', category: 'Info', href: '#faq' },
  { title: 'Glass Maintenance Guide', category: 'Maintenance', href: '#maintenance' },
  { title: 'Tempered Glass Cleaning Methods', category: 'Maintenance', href: '#maintenance' },
  { title: 'Contact Us for a Quote', category: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [isConsultSuccess, setIsConsultSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { language, toggleLanguage } = useLanguage();

  const [isScrolled, setIsScrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = language === 'ar' ? [
    { name: 'الرئيسية', href: '#' },
    { name: 'خدماتنا', href: '#services' },
    { name: 'أعمالنا', href: '#gallery' },
    { name: 'تواصل معنا', href: '#contact' },
  ] : [
    { name: 'Home', href: '#' },
    { name: 'Services', href: '#services' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact Us', href: '#contact' },
  ];

  const searchData = language === 'ar' ? searchDataAr : searchDataEn;

  const filteredResults = searchData.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isSearchOpen || isConsultOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSearchOpen, isConsultOpen]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#0284C7] origin-left rtl:origin-right z-[60]"
        style={{ scaleX }}
      />
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm' : 'bg-white border-b border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-[#0284C7] rounded-sm flex items-center justify-center text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="font-bold text-2xl text-[#0F172A] tracking-tight">
              {language === 'ar' ? 'روائع الزجاج' : 'Rawae Glass'}
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse ltr:space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-500 hover:text-[#111827] font-medium text-sm uppercase tracking-widest transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={toggleLanguage}
              className="text-gray-500 hover:text-[#0284C7] font-bold text-sm tracking-widest transition-colors flex items-center gap-1 ml-2 rtl:mr-2"
              aria-label="Toggle Language"
            >
              <Globe className="h-4 w-4" />
              <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
            </button>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-gray-500 hover:text-[#111827] transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsConsultOpen(true)}
                className="bg-transparent border border-gray-300 text-[#0F172A] px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <CalendarDays className="h-4 w-4" />
                <span>{language === 'ar' ? 'احجز استشارة' : 'Book Consult'}</span>
              </button>
              <a
                href="#contact"
                className="bg-[#111827] text-white px-6 py-2 text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                <span>{language === 'ar' ? 'اطلب تسعيرة' : 'Get a Quote'}</span>
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="text-gray-600 hover:text-[#0284C7] font-bold text-sm focus:outline-none flex items-center gap-1"
            >
              <Globe className="h-4 w-4" />
              <span>{language === 'ar' ? 'EN' : 'AR'}</span>
            </button>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-1"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-[#111827] text-sm uppercase tracking-widest font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-4 px-4">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsConsultOpen(true);
                  }}
                  className="w-full text-center bg-transparent border border-gray-300 text-[#0F172A] px-6 py-3 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <CalendarDays className="h-4 w-4" />
                  <span>{language === 'ar' ? 'احجز استشارة' : 'Book a Consultation'}</span>
                </button>
                <a
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center bg-[#111827] text-white px-6 py-3 font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  <span>{language === 'ar' ? 'اطلب تسعيرة الآن' : 'Get a Quote Now'}</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Consultation Modal */}
      <AnimatePresence>
        {isConsultOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-gray-900/60 backdrop-blur-sm flex justify-center items-center p-4"
            onClick={() => setIsConsultOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg shadow-2xl overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <button
                  onClick={() => setIsConsultOpen(false)}
                  className="absolute top-6 right-6 ltr:right-auto ltr:left-6 text-gray-400 hover:text-gray-900 transition-colors z-10"
                >
                  <X className="h-6 w-6" />
                </button>
                <AnimatePresence mode="wait">
                  {!isConsultSuccess ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-3 mb-6 mt-2">
                        <div className="w-12 h-12 bg-[#0284C7]/10 text-[#0284C7] flex items-center justify-center rounded-sm">
                          <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#0F172A]">
                            {language === 'ar' ? 'احجز استشارة مجانية' : 'Book Free Consultation'}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {language === 'ar' ? 'حدد موعداً لزيارة خبيرنا لموقعك.' : 'Schedule a site visit with our expert.'}
                          </p>
                        </div>
                      </div>

                      <form className="space-y-4" onSubmit={(e) => { 
                        e.preventDefault(); 
                        setIsConsultSuccess(true);
                        setTimeout(() => {
                          setIsConsultOpen(false);
                          setTimeout(() => setIsConsultSuccess(false), 300); // reset after animation
                        }, 2500);
                      }}>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">{language === 'ar' ? 'الاسم' : 'Name'}</label>
                          <input type="text" required className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3 focus:outline-none focus:border-[#0284C7] transition-colors" placeholder={language === 'ar' ? 'الاسم الكريم' : 'Your name'} />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
                          <input type="tel" required className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3 focus:outline-none focus:border-[#0284C7] transition-colors" placeholder={language === 'ar' ? '05xxxxxxxx' : '05xxxxxxxx'} dir="ltr" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{language === 'ar' ? 'التاريخ المفضل' : 'Preferred Date'}</label>
                            <input type="date" required className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3 focus:outline-none focus:border-[#0284C7] transition-colors" />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{language === 'ar' ? 'الوقت المفضل' : 'Preferred Time'}</label>
                            <select className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3 focus:outline-none focus:border-[#0284C7] transition-colors appearance-none">
                              <option>{language === 'ar' ? 'الصباح (8ص - 12م)' : 'Morning (8AM - 12PM)'}</option>
                              <option>{language === 'ar' ? 'المساء (4م - 9م)' : 'Evening (4PM - 9PM)'}</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">{language === 'ar' ? 'عنوان الموقع / ملاحظات' : 'Location / Notes'}</label>
                          <textarea rows={3} className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3 focus:outline-none focus:border-[#0284C7] transition-colors resize-none" placeholder={language === 'ar' ? 'اكتب عنوان المشروع أو أي تفاصيل أخرى...' : 'Enter project location or other details...'}></textarea>
                        </div>
                        <button type="submit" className="w-full bg-[#0284C7] text-white p-4 font-bold hover:bg-[#0369A1] transition-colors mt-2">
                          {language === 'ar' ? 'تأكيد الحجز' : 'Confirm Booking'}
                        </button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="py-16 flex flex-col items-center justify-center text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                        className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6"
                      >
                        <CheckCircle2 className="h-10 w-10" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-[#0F172A] mb-2">
                        {language === 'ar' ? 'تم استلام طلبك بنجاح!' : 'Request Received Successfully!'}
                      </h3>
                      <p className="text-gray-500">
                        {language === 'ar' ? 'سنتواصل معك قريباً لتأكيد الموعد.' : 'We will contact you soon to confirm the appointment.'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-gray-900/50 backdrop-blur-sm flex justify-center items-start pt-20 px-4"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white w-full max-w-2xl rounded-none shadow-2xl overflow-hidden border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'ابحث عن الخدمات، أعمالنا، العناية بالزجاج...' : 'Search for services, gallery, glass care...'}
                  className="flex-1 bg-transparent border-none outline-none text-[#0F172A] placeholder-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto p-2">
                {searchQuery.trim() === '' ? (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    {language === 'ar' ? 'ابدأ الكتابة للبحث في محتوى الموقع' : 'Start typing to search the website'}
                  </div>
                ) : filteredResults.length > 0 ? (
                  <div className="flex flex-col">
                    {filteredResults.map((result, i) => (
                      <a
                        key={i}
                        href={result.href}
                        onClick={() => setIsSearchOpen(false)}
                        className="p-4 hover:bg-gray-50 flex items-center justify-between border-b border-gray-50 last:border-0 transition-colors"
                      >
                        <span className="font-bold text-[#0F172A] text-sm">{result.title}</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#0284C7] bg-[#0284C7]/10 px-2 py-1">
                          {result.category}
                        </span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    {language === 'ar' ? `لم نتمكن من العثور على نتائج مطابقة لـ "${searchQuery}"` : `No results found for "${searchQuery}"`}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </>
  );
}
