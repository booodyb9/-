import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn } from 'lucide-react';

const projects = [

  {
    title: 'واجهات شركات تجارية',
    category: 'واجهات زجاجية',
    description: 'واجهات زجاجية مزدوجة معزولة حرارياً للشركات والمباني الإدارية الكبرى.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    className: 'md:col-span-2 md:row-span-2'
  },
  {
    title: 'قواطع مكتبية حديثة',
    category: 'قواطع زجاجية',
    description: 'قواطع سيكوريت 12 ملم مقسّى للمكاتب لتوفير بيئة عمل مفتوحة وهادئة.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
    className: 'col-span-1 row-span-1'
  },
  {
    title: 'نوافذ فلل سكنية',
    category: 'أبواب ونوافذ',
    description: 'تركيب نوافذ ألمنيوم وزجاج دبل جلاس بتصاميم عصرية للفلل والقصور.',
    image: 'https://images.unsplash.com/photo-1600566753386-8a9d16a70e70?q=80&w=2070&auto=format&fit=crop',
    className: 'col-span-1 row-span-1'
  },
  {
    title: 'كبائن شاور فاخرة',
    category: 'تصميم داخلي',
    description: 'تفصيل كبائن شاور زجاجية مقاومة للصدأ مع إكسسوارات ذهبية وفضية مميزة.',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=2069&auto=format&fit=crop',
    className: 'col-span-1 row-span-1'
  },
  {
    title: 'مرايا ديكورية',
    category: 'مرايا',
    description: 'تصاميم مرايا هندسية مضيئة بلمبات ليد مخفية لغرف المعيشة والصالونات.',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2054&auto=format&fit=crop',
    className: 'md:col-span-2 row-span-1'
  }
];

const categories = ['الكل', 'واجهات زجاجية', 'قواطع زجاجية', 'أبواب ونوافذ', 'تصميم داخلي', 'مرايا'];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const filteredProjects = activeCategory === 'الكل' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  const phoneNumber = "966510233706";

  return (
    <section id="gallery" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8"
        >
          <div className="max-w-2xl">
            <h2 className="text-[#0284C7] text-sm font-bold tracking-widest uppercase mb-3">أعمالنا</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] leading-tight">
              معرض المشاريع المنجزة
            </h3>
          </div>
          <p className="text-lg text-gray-600 max-w-md border-r-2 border-[#0284C7] pr-4">
            تصفح مجموعة من أحدث مشاريعنا في تركيب الزجاج وتصميم الواجهات، والتي تعكس التزامنا بالجودة والاحترافية.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 text-sm font-bold tracking-widest transition-colors ${
                activeCategory === cat 
                  ? 'bg-[#111827] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-3 auto-rows-[300px] md:auto-rows-[250px] gap-6">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`group relative overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer ${
                  activeCategory === 'الكل' ? project.className || '' : 'md:col-span-1 row-span-1'
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/95 via-[#111827]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-[#0284C7] text-xs font-bold tracking-widest uppercase mb-2">{project.category}</span>
                  <h4 className="text-white text-xl font-bold mb-2">{project.title}</h4>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{project.description}</p>
                  
                  <a
                    href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(`مرحباً، أود الاستفسار عن مشروع ${project.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-2 text-sm font-bold rounded-sm hover:bg-[#128C7E] transition-colors w-fit"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                    </svg>
                    استفسار عبر واتساب
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-sm"
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-[#111827] rounded-sm overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <div className="w-full md:w-2/3 h-[40vh] md:h-[70vh]">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full md:w-1/3 p-8 flex flex-col justify-center border-t md:border-t-0 md:border-r border-gray-800">
                <span className="text-[#0284C7] text-sm font-bold tracking-widest uppercase mb-2">
                  {selectedProject.category}
                </span>
                <h4 className="text-white text-3xl font-bold mb-4">{selectedProject.title}</h4>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  {selectedProject.description}
                </p>
                <a
                  href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(`مرحباً، أود الاستفسار عن مشروع ${selectedProject.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white px-6 py-4 text-lg font-bold rounded-sm hover:bg-[#128C7E] transition-colors w-full"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  استفسار عبر واتساب
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
