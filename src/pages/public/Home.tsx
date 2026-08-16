import React, { Suspense } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';

// Lazy load below-the-fold components to improve initial page load performance
const GallerySlider = React.lazy(() => import('../../components/GallerySlider'));
const Services = React.lazy(() => import('../../components/Services'));
const Gallery = React.lazy(() => import('../../components/Gallery'));
const Features = React.lazy(() => import('../../components/Features'));
const Process = React.lazy(() => import('../../components/Process'));
const ProjectStats = React.lazy(() => import('../../components/ProjectStats'));
const TrustedPartners = React.lazy(() => import('../../components/TrustedPartners'));
const Testimonials = React.lazy(() => import('../../components/Testimonials'));
const FAQ = React.lazy(() => import('../../components/FAQ'));
const Blog = React.lazy(() => import('../../components/Blog'));
const CostCalculator = React.lazy(() => import('../../components/CostCalculator'));
const Contact = React.lazy(() => import('../../components/Contact'));
const Footer = React.lazy(() => import('../../components/Footer'));

const SectionFallback = () => <div className="h-48 w-full bg-slate-50 animate-pulse" />;

export default function Home() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <>
      <SEO 
        title={isAr ? 'زجاج الرياض | حلول زجاجية فاخرة' : 'Riyadh Glass | Premium Glass Solutions'} 
        description={isAr ? 'شركة زجاج الرياض لتركيب الواجهات والقواطع الزجاجية.' : 'Riyadh Glass for Facades and Partitions Installations.'} 
      />
      
      <Navbar />
      
      {/* 1. Hero / Intro (Eager) */}
      <Hero />
      
      <Suspense fallback={<SectionFallback />}>
        {/* 2. Portfolio Slider */}
        <GallerySlider />

        {/* 3. Services */}
        <Services />

        {/* 4. Portfolio Grid */}
        <Gallery />
        
        {/* 5. Why Choose Us (Features) */}
        <Features />
        
        {/* 6. How We Work */}
        <Process />

        {/* 7. Statistics */}
        <ProjectStats />

        {/* 8. Trust Signals */}
        <TrustedPartners />
        
        {/* 9. Social Proof */}
        <Testimonials />
        
        {/* 10. Knowledge & Objections */}
        <FAQ />
        
        {/* 11. Education / Content */}
        <Blog />
        
        {/* 12. Cost Calculator */}
        <section className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
          <CostCalculator />
        </section>
        
        {/* 13. Final Action */}
        <Contact />
        
        {/* 14. Footer */}
        <Footer />
      </Suspense>
    </>
  );
}
