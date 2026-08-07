import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, ArrowLeft } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { PortfolioProject } from '../pages/dashboard/types';

export default function RecentProjects({ limit = 6 }: { limit?: number, key?: React.Key }) {
  const { getContent } = useContent();
  const portfolioContent = getContent('premium_portfolio_projects');
  const [projects, setProjects] = useState<PortfolioProject[]>([]);

  useEffect(() => {
    let baseProjects = [];
    if (portfolioContent?.body) {
      try {
        const parsed = JSON.parse(portfolioContent.body);
        if (Array.isArray(parsed) && parsed.length > 0) {
          baseProjects = parsed;
        }
      } catch (e) {
        console.error("Failed to parse portfolio projects", e);
      }
    }
    
    if (baseProjects.length === 0) {
      baseProjects = [
        {
          id: '1',
          title: 'واجهات برج المكاتب - الرياض',
          category: 'واجهات زجاجية',
          coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          description: 'تركيب واجهة كرتن وول للمبنى بالكامل مع زجاج مزدوج عازل للحرارة والصوت.',
          location: 'الرياض',
          isFeatured: true,
          isHidden: false,
          order: 1
        },
        {
          id: '2',
          title: 'قواطع شركة التقنية',
          category: 'قواطع مكتبية',
          coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          description: 'تنفيذ قواطع زجاجية ذكية عازلة للصوت لمكاتب الإدارة وقاعات الاجتماعات.',
          location: 'الرياض',
          isFeatured: true,
          isHidden: false,
          order: 2
        },
        {
          id: '3',
          title: 'فيلا حي النرجس',
          category: 'درابزين وسلالم',
          coverImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          description: 'تصميم وتركيب درابزين زجاجي سيكوريت 12 ملم للسلالم الداخلية والشرفات.',
          location: 'الرياض',
          isFeatured: true,
          isHidden: false,
          order: 3
        }
      ] as any;
    }

    let validProjects = baseProjects.filter(p => !p.isHidden);
    // Sort to get the most recent first (if there's a date, else use order)
    validProjects.sort((a, b) => (b.order || 0) - (a.order || 0));
    
    if (limit) {
      validProjects = validProjects.slice(0, limit);
    }
    setProjects(validProjects);
  }, [portfolioContent, limit]);

  return (
    <section className="py-20 bg-gray-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 font-['Tajawal'] tracking-tight">
              أحدث المشاريع المنجزة
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-['Tajawal']">
              استعرض أحدث أعمالنا في تركيب واجهات الزجاج والقواطع بالرياض
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 flex flex-col h-full"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
                    alt={project.title || 'صورة'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-white/90 backdrop-blur-sm text-[#0284C7] text-sm font-bold px-4 py-1.5 rounded-full shadow-sm">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0284C7] transition-colors font-['Tajawal']">
                    {project.title}
                  </h3>
                  
                  {project.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed flex-grow">
                      {project.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 ml-1.5 text-[#0284C7]" />
                      <span>{project.location || 'الرياض'}</span>
                    </div>
                    
                    <Link
                      to={`/portfolio/${project.id}`}
                      className="inline-flex items-center justify-center p-2 rounded-full bg-gray-50 text-[#0284C7] hover:bg-[#0284C7] hover:text-white transition-colors duration-300"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            to="/portfolio"
            className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-[#0284C7] text-base font-bold rounded-lg text-[#0284C7] hover:bg-[#0284C7] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
          >
            عرض كل المشاريع
            <ArrowLeft className="mr-2 w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
