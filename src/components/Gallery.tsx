import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, ChevronRight, ChevronLeft, MapPin, Briefcase } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { PortfolioProject } from '../pages/dashboard/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function Gallery({ limit, featuredOnly }: { limit?: number, featuredOnly?: boolean }) {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const { getContent } = useContent();
  const portfolioContent = getContent('premium_portfolio_projects');

  useEffect(() => {
    if (portfolioContent?.body) {
      try {
        const parsed = JSON.parse(portfolioContent.body);
        if (Array.isArray(parsed)) {
          let validProjects = parsed.filter(p => !p.isHidden);
          validProjects.sort((a, b) => (a.order || 0) - (b.order || 0));
          if (featuredOnly) {
            validProjects = validProjects.filter(p => p.isFeatured);
          }
          if (limit) {
            validProjects = validProjects.slice(0, limit);
          }
          setProjects(validProjects);
        }
      } catch (e) {
        console.error("Failed to parse portfolio projects", e);
      }
    }
  }, [portfolioContent, limit, featuredOnly]);

  const categories = useMemo(() => {
    const cats = new Set(projects.map(p => p.category));
    return ['الكل', ...Array.from(cats)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let result = activeCategory === 'الكل' 
      ? projects 
      : projects.filter(p => p.category === activeCategory);
      
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title?.toLowerCase().includes(query) || 
        p.description?.toLowerCase().includes(query) ||
        p.location?.toLowerCase().includes(query) ||
        p.serviceType?.toLowerCase().includes(query)
      );
    }
    return result;
  }, [projects, activeCategory, searchQuery]);

  return (
    <section className="py-24 bg-transparent relative overflow-hidden" id="portfolio">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[#0284C7] text-sm font-bold tracking-widest uppercase mb-3">
              معرض الأعمال
            </h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] leading-tight mb-6">
              مشاريع نفخر بها
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              تصفح أحدث مشاريعنا المتميزة في توريد وتركيب الزجاج، واكتشف جودة تنفيذنا ودقة تفاصيلنا في مختلف القطاعات.
            </p>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex flex-wrap justify-center md:justify-start gap-3 w-full md:w-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-[#0284C7] text-white shadow-md scale-105'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-[#0284C7] shadow-sm'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {!limit && (
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="ابحث في المشاريع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent transition-all shadow-sm bg-transparent"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          )}
        </div>

        {/* Projects Display */}
        {limit ? (
          <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0 pb-12">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={32}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true, dynamicBullets: true }}
              navigation={{
                nextEl: '.swiper-button-next-portfolio',
                prevEl: '.swiper-button-prev-portfolio',
              }}
              className="!pb-16"
              loop={filteredProjects.length >= 4}
            >
              {filteredProjects.map((project, index) => (
                <SwiperSlide key={project.id} className="h-auto pb-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 h-full flex flex-col"
                  >
                    <Link to={`/portfolio/${project.slug}`} className="block relative h-72 overflow-hidden shrink-0">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10 duration-500" />
                      <img
                        src={project.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute top-4 right-4 z-20">
                        <span className="bg-white/90 backdrop-blur-sm text-[#0F172A] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                          {project.category}
                        </span>
                      </div>
                    </Link>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <Link to={`/portfolio/${project.slug}`}>
                        <h4 className="text-xl font-bold text-[#0F172A] mb-2 group-hover:text-[#0284C7] transition-colors">
                          {project.title}
                        </h4>
                      </Link>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      
                      <div className="flex flex-col gap-2 mb-6 mt-auto">
                        {project.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4 text-[#0284C7]" />
                            <span>{project.location}</span>
                          </div>
                        )}
                        {project.serviceType && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Briefcase className="w-4 h-4 text-[#0284C7]" />
                            <span>{project.serviceType}</span>
                          </div>
                        )}
                      </div>
                      
                      <Link 
                        to={`/portfolio/${project.slug}`}
                        className="inline-flex items-center gap-2 text-[#0284C7] font-bold hover:text-[#0369A1] transition-colors group/btn"
                      >
                        عرض التفاصيل
                        <ChevronLeft className="w-4 h-4 transform group-hover/btn:-translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
            <button className="swiper-button-prev-portfolio absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 z-10 bg-white shadow-lg p-3 rounded-full text-[#0284C7] hover:bg-[#0284C7] hover:text-white transition-colors hidden sm:block">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="swiper-button-next-portfolio absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 z-10 bg-white shadow-lg p-3 rounded-full text-[#0284C7] hover:bg-[#0284C7] hover:text-white transition-colors hidden sm:block">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  key={project.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col"
                >
                  <Link to={`/portfolio/${project.slug}`} className="block relative h-72 overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10 duration-500" />
                    <img
                      src={project.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-4 right-4 z-20">
                      <span className="bg-white/90 backdrop-blur-sm text-[#0F172A] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        {project.category}
                      </span>
                    </div>
                  </Link>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <Link to={`/portfolio/${project.slug}`}>
                      <h4 className="text-xl font-bold text-[#0F172A] mb-2 group-hover:text-[#0284C7] transition-colors">
                        {project.title}
                      </h4>
                    </Link>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-col gap-2 mb-6 mt-auto">
                      {project.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4 text-[#0284C7]" />
                          <span>{project.location}</span>
                        </div>
                      )}
                      {project.serviceType && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Briefcase className="w-4 h-4 text-[#0284C7]" />
                          <span>{project.serviceType}</span>
                        </div>
                      )}
                    </div>
                    
                    <Link 
                      to={`/portfolio/${project.slug}`}
                      className="inline-flex items-center gap-2 text-[#0284C7] font-bold hover:text-[#0369A1] transition-colors group/btn"
                    >
                      عرض التفاصيل
                      <ChevronLeft className="w-4 h-4 transform group-hover/btn:-translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        
        {(!limit && filteredProjects.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            لا توجد مشاريع في هذا التصنيف حالياً.
          </div>
        )}

        {limit && projects.length > limit && (
          <div className="text-center mt-12">
            <Link 
              to="/portfolio"
              className="inline-flex items-center gap-2 bg-transparent text-[#0F172A] border-2 border-gray-200 px-8 py-3 rounded-full font-bold hover:border-[#0284C7] hover:text-[#0284C7] transition-all"
            >
              عرض كل المشاريع
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
