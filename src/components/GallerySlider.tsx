import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function GallerySlider() {
  const slides = [
    {
      img: 'https://wfmmedia.com/wp-content/uploads/2024/11/Modern-Glass-Facade-Architecture.webp',
      title: 'واجهات أبراج الرياض',
      subtitle: 'FACADES'
    },
    {
      img: 'https://knrslidingdoors.com/wp-content/uploads/2024/05/IMG_3277-scaled.jpg',
      title: 'قواطع مكتبية عازلة',
      subtitle: 'PARTITIONS'
    },
    {
      img: 'https://www.glassartdesign.com/wp-content/uploads/2025/05/Glass-Shower-Enclosures.jpg',
      title: 'شاور بوكس فاخر',
      subtitle: 'SHOWER'
    },
    {
      img: 'https://glassenterprises.com/wp-content/uploads/2022/11/modern-buildings-with-glass-facade-1024x1024.jpg',
      title: 'واجهات بانورامية',
      subtitle: 'FACADES'
    },
    {
      img: 'https://www.viewrail.com/wp-content/uploads/2018/11/172A9943-scaled.jpg',
      title: 'درابزين زجاجي للسلم',
      subtitle: 'RAILINGS'
    }
  ];

  return (
    <section className="bg-gray-50 py-20 overflow-hidden" id="gallery-slider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">جولة في أعمالنا المميزة</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">تصفح أبرز المشاريع التي قمنا بتنفيذها مؤخراً باستخدام أحدث تقنيات الزجاج</p>
      </div>

      <div className="w-full">
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          coverflowEffect={{
            rotate: 20,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          className="w-full max-w-7xl px-4 py-12"
          style={{ '--swiper-theme-color': '#0284C7' } as any}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className="w-[300px] h-[400px] md:w-[500px] md:h-[500px] relative rounded-xl overflow-hidden shadow-2xl group" >
              <img loading="lazy" decoding="async" src={slide.img} alt={slide.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8 opacity-90 transition-opacity group-hover:opacity-100">
                <span className="text-[#0284C7] font-bold text-sm tracking-wider uppercase mb-2">{slide.subtitle}</span>
                <h3 className="text-white text-2xl font-bold">{slide.title}</h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
