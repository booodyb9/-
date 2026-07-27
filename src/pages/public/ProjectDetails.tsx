import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useContent } from '../../contexts/ContentContext';
import { PortfolioProject } from '../dashboard/types';
import { ArrowRight, Calendar, MapPin, Briefcase, User, Wrench, Phone, MessageCircle, X, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

export default function ProjectDetails() {
  const { slug } = useParams();
  const { getContent } = useContent();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<PortfolioProject[]>([]);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Before/After state
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const portfolioContent = getContent('premium_portfolio_projects');
    if (portfolioContent && portfolioContent.body) {
      try {
        const projects: PortfolioProject[] = JSON.parse(portfolioContent.body);
        const found = projects.find(p => p.slug === slug || p.id === slug);
        setProject(found || null);
        
        if (found) {
          const related = projects
            .filter(p => p.id !== found.id && p.category === found.category && !p.isHidden)
            .slice(0, 3);
          setRelatedProjects(related);
        }
      } catch (e) {}
    }
  }, [slug, getContent]);

  const handleMove = (clientX: number) => {
    if (!sliderRef.current || !isDragging) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  if (!project) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-12 px-4 flex flex-col items-center justify-center bg-gray-50">
          <div className="w-16 h-16 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin mb-6"></div>
          <h1 className="text-2xl font-bold text-gray-600 mb-4">جاري التحميل...</h1>
          <Link to="/portfolio" className="text-[#0284C7] hover:underline font-bold">العودة لمعرض الأعمال</Link>
        </main>
        <Footer />
      </>
    );
  }

  const allImages = [
    ...(project.image && !project.coverImage ? [project.image] : []),project.coverImage, ...(project.galleryImages || [])].filter(Boolean);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const prevLightboxImage = () => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  const nextLightboxImage = () => setLightboxIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));

  return (
    <>
      <SEO 
        title={`${project.seoTitle || project.title} | زجاج الرياض`} 
        description={project.seoDescription || project.description} 
      />
      <Navbar />

      {/* Hero Banner with Cover Image */}
      <section className="relative pt-20 lg:pt-24 min-h-[60vh] flex flex-col justify-end">
        <div className="absolute inset-0 z-0">
          <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-black/30" />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Link to="/portfolio" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowRight className="w-5 h-5" />
            <span>العودة للمعرض</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="bg-[#0284C7] text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                {project.category}
              </span>
              {project.serviceType && (
                <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-bold border border-white/30">
                  {project.serviceType}
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              {project.title}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-white/90 font-medium">
              {project.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#0284C7]" />
                  <span>{project.location}</span>
                </div>
              )}
              {project.completionDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#0284C7]" />
                  <span dir="ltr">{project.completionDate}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <main className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Left Column: Details & Details List */}
            <div className="lg:col-span-1 order-2 lg:order-1 space-y-12">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-[#0F172A] mb-6 border-b border-gray-200 pb-4">تفاصيل المشروع</h3>
                <ul className="space-y-6">
                  {project.client && (
                    <li className="flex gap-4">
                      <div className="bg-white p-3 rounded-xl shadow-sm h-fit text-[#0284C7]">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">العميل</p>
                        <p className="font-bold text-[#0F172A]">{project.client}</p>
                      </div>
                    </li>
                  )}
                  {project.materialsUsed && (
                    <li className="flex gap-4">
                      <div className="bg-white p-3 rounded-xl shadow-sm h-fit text-[#0284C7]">
                        <Wrench className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">المواد المستخدمة</p>
                        <p className="font-bold text-[#0F172A]">{project.materialsUsed}</p>
                      </div>
                    </li>
                  )}
                  {project.serviceType && (
                    <li className="flex gap-4">
                      <div className="bg-white p-3 rounded-xl shadow-sm h-fit text-[#0284C7]">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">نوع الخدمة</p>
                        <p className="font-bold text-[#0F172A]">{project.serviceType}</p>
                      </div>
                    </li>
                  )}
                </ul>
                
                <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                  <a href={`https://wa.me/966510233706?text=مرحباً، أود الاستفسار عن مشروع ${project.title}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-3 px-4 rounded-xl font-bold hover:bg-[#1EBE57] transition-all shadow-sm hover:shadow-md ripple btn-base">
                    <MessageCircle className="w-5 h-5" />
                    تواصل عبر واتساب
                  </a>
                  <a href="tel:0510233706" className="flex items-center justify-center gap-2 w-full bg-white text-[#0F172A] border-2 border-gray-200 py-3 px-4 rounded-xl font-bold hover:border-[#0284C7] hover:text-[#0284C7] transition-all ripple btn-base">
                    <Phone className="w-5 h-5" />
                    اتصل بنا
                  </a>
                  <Link to="/request-quote" className="flex items-center justify-center gap-2 w-full bg-[#0F172A] text-white py-3 px-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-sm ripple btn-base">
                    طلب تسعيرة مشابهة
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Content & Gallery */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-[#0F172A] mb-6">عن المشروع</h2>
                <div className="prose prose-lg text-gray-600 max-w-none leading-relaxed whitespace-pre-line">
                  {project.description}
                </div>
              </motion.div>

              {/* Before/After Slider */}
              {project.beforeImage && project.afterImage && (
                <div className="mb-16">
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-6">قبل وبعد التنفيذ</h3>
                  <div 
                    ref={sliderRef}
                    className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden cursor-ew-resize select-none shadow-lg border border-gray-100"
                    onMouseMove={(e) => isDragging && handleMove(e.clientX)}
                    onTouchMove={(e) => isDragging && handleMove(e.touches[0].clientX)}
                    onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
                    onTouchStart={(e) => { setIsDragging(true); handleMove(e.touches[0].clientX); }}
                  >
                    <img src={project.afterImage} loading="lazy" alt="بعد التنفيذ" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 font-bold px-4 py-1.5 rounded-full shadow-sm z-10 text-sm">بعد</div>
                    
                    <div 
                      className="absolute inset-y-0 right-0 overflow-hidden"
                      style={{ width: `${100 - sliderPosition}%` }}
                    >
                      <img 
                        src={project.beforeImage} 
                        loading="lazy"
                        alt="قبل التنفيذ" 
                        className="absolute inset-y-0 right-0 h-full object-cover max-w-none" 
                        style={{ width: `${sliderRef.current?.offsetWidth || 0}px` }}
                        draggable={false}
                      />
                      <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm text-white font-bold px-4 py-1.5 rounded-full shadow-sm z-10 text-sm">قبل</div>
                    </div>
                    
                    <div 
                      className="absolute inset-y-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 flex items-center justify-center transform -translate-x-1/2"
                      style={{ right: `${100 - sliderPosition}%` }}
                    >
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-[#0F172A]">
                        <ChevronLeft className="w-4 h-4" />
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Image Gallery */}
              {allImages.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-6">معرض صور المشروع</h3>
                  
                  <Swiper
                    style={{ '--swiper-navigation-color': '#fff', '--swiper-pagination-color': '#fff' } as any}
                    spaceBetween={10}
                    navigation={true}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="rounded-2xl overflow-hidden shadow-md mb-4 group aspect-[16/9]"
                  >
                    {allImages.map((src, index) => (
                      <SwiperSlide key={index} className="cursor-pointer" onClick={() => openLightbox(index)}>
                        <img src={src} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt={`صورة ${index + 1}`} loading="lazy" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 text-white font-bold bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm transition-all transform scale-90 group-hover:scale-100">
                            تكبير الصورة
                          </span>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="thumbs-swiper"
                    breakpoints={{
                      640: { slidesPerView: 5 },
                      768: { slidesPerView: 6 },
                    }}
                  >
                    {allImages.map((src, index) => (
                      <SwiperSlide key={index} className="rounded-xl overflow-hidden cursor-pointer opacity-60 hover:opacity-100 [&.swiper-slide-thumb-active]:opacity-100 [&.swiper-slide-thumb-active]:border-2 [&.swiper-slide-thumb-active]:border-[#0284C7] transition-all h-20 md:h-24">
                        <img src={src} className="w-full h-full object-cover" alt={`مصغرة ${index + 1}`} loading="lazy" />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-20 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-[#0F172A] mb-10 text-center">مشاريع ذات صلة</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((relProject) => (
                <Link to={`/portfolio/${relProject.slug}`} key={relProject.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 block">
                  <div className="h-60 relative overflow-hidden">
                    <img src={relProject.coverImage} alt={relProject.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-xl text-[#0F172A] mb-2 group-hover:text-[#0284C7] transition-colors">{relProject.title}</h4>
                    <p className="text-gray-500 text-sm line-clamp-2">{relProject.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-md"
          >
            <button 
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-[110]"
            >
              <X className="w-8 h-8" />
            </button>

            <button 
              onClick={prevLightboxImage}
              className="absolute left-4 md:left-10 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-[110]"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button 
              onClick={nextLightboxImage}
              className="absolute right-4 md:right-10 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-[110]"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="absolute top-6 left-6 text-white font-bold bg-white/10 px-4 py-2 rounded-full z-[110]">
              {lightboxIndex + 1} / {allImages.length}
            </div>

            <motion.img 
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={allImages[lightboxIndex]}
              className="max-w-[95vw] max-h-[90vh] object-contain select-none"
              alt={`صورة ${lightboxIndex + 1}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </>
  );
}
