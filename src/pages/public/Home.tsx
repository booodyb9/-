import React, { useMemo } from 'react';
import { useContent } from '../../contexts/ContentContext';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Hero from '../../components/Hero';
import Services from '../../components/Services';
import GlassVisualizer from '../../components/GlassVisualizer';
import Gallery from '../../components/Gallery';
import ProjectStats from '../../components/ProjectStats';
import Features from '../../components/Features';
import TrustedPartners from '../../components/TrustedPartners';
import WhatsAppButton from '../../components/WhatsAppButton';
import ChatBubble from '../../components/ChatBubble';
import Blog from '../../components/Blog';
import Testimonials from '../../components/Testimonials';
import FAQ from '../../components/FAQ';
import Contact from '../../components/Contact';
import Process from '../../components/Process';
import SplashAnimation from '../../components/SplashAnimation';

export default function Home() {
  const { getContent } = useContent();
  const homepageContent = getContent('homepage_sections');

  const orderedSections = useMemo(() => {
    let sections = [
            { id: 'hero', isVisible: true },
      { id: 'services', isVisible: true },
      { id: 'portfolio', isVisible: true },
      { id: 'features', isVisible: true },
      { id: 'visualizer', isVisible: true },
      { id: 'stats', isVisible: true },
      { id: 'partners', isVisible: true }
    ];

    if (homepageContent?.body) {
      try {
        const parsed = JSON.parse(homepageContent.body);
        if (Array.isArray(parsed) && parsed.length > 0) {
          sections = parsed;
        }
      } catch (e) {}
    }
    return sections;
  }, [homepageContent]);

  return (
    <>
      <SEO title="الرئيسية | شركة زجاج الرياض" description="شركة زجاج الرياض لتركيب الواجهات والقواطع الزجاجية." />
      <SplashAnimation />
      <Navbar />
      <main>
                {orderedSections.map((section: any, index: number) => {
          if (!section.isVisible) return null;
          
          const key = `${section.id}-${index}`;
          switch (section.id) {
            case 'hero': return <Hero key={key} />;
            case 'services': return <Services key={key} />;
            case 'portfolio': return <div key={key}><Gallery limit={6} featuredOnly /></div>;
            case 'features': return <Features key={key} />;
            case 'visualizer': return <GlassVisualizer key={key} />;
            case 'stats': return <ProjectStats key={key} />;
            case 'partners': return <TrustedPartners key={key} />;
            case 'blog': return <Blog key={key} />;
            case 'testimonials': return <Testimonials key={key} />;
            case 'faq': return <FAQ key={key} />;
            case 'contact': return <Contact key={key} />;
            case 'process': return <Process key={key} />;
            default: return null;
          }
        })}
      </main>
      <Footer />
      <WhatsAppButton />
      <ChatBubble />
    </>
  );
}
