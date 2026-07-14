/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Process from './components/Process';
import GlassVisualizer from './components/GlassVisualizer';
import ProjectStats from './components/ProjectStats';
import Features from './components/Features';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import TrustedPartners from './components/TrustedPartners';
import FAQ from './components/FAQ';
import Maintenance from './components/Maintenance';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ChatBubble from './components/ChatBubble';
import SplashAnimation from './components/SplashAnimation';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { ContentProvider } from './contexts/ContentContext';
import SEO from './components/SEO';
import Dashboard from './pages/Dashboard';
import AdminRoute from './components/AdminRoute';

import { useEffect } from 'react';

function MainSite({ activeSection = '' }: { activeSection?: string }) {
  useEffect(() => {
    if (activeSection) {
      // Add a small delay to allow for rendering
      setTimeout(() => {
        const element = document.getElementById(activeSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, [activeSection]);

  return (
    <>
      <SplashAnimation />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <GlassVisualizer />
        <Gallery />
        <Features />
        <ProjectStats />
        <Process />
        <TrustedPartners />
        <Maintenance />
        <Testimonials />
        <FAQ />
        <Blog />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <ChatBubble />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ContentProvider>
          <div className="min-h-screen bg-white font-sans text-right ltr:text-left">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<><SEO /><MainSite /></>} />
                <Route path="/services" element={<><SEO title="خدماتنا | واجهات، قواطع، شاور" description="نقدم خدمات تركيب الواجهات الزجاجية، القواطع المكتبية، كبائن الشاور، والمرايا بأعلى معايير الجودة." path="/services" /><MainSite activeSection="services" /></>} />
                <Route path="/gallery" element={<><SEO title="معرض الأعمال | مشاريعنا الزجاجية" description="تصفح معرض أعمالنا ومشاريعنا السابقة في تركيب الواجهات الزجاجية والكبائن والقواطع." path="/gallery" /><MainSite activeSection="gallery" /></>} />
                <Route path="/contact" element={<><SEO title="تواصل معنا | شركة زجاج الرياض" description="تواصل معنا لطلب تسعيرة أو حجز استشارة لخدمات تركيب الزجاج في الرياض." path="/contact" /><MainSite activeSection="contact" /></>} />
                <Route path="/faq" element={<><SEO title="الأسئلة الشائعة" description="إجابات على أهم الأسئلة حول تركيب الزجاج، الأسعار، الضمان، ومدة التنفيذ." path="/faq" /><MainSite activeSection="faq" /></>} />
                <Route path="/maintenance" element={<><SEO title="صيانة الزجاج | العناية بالزجاج المقسى" description="دليل شامل للعناية بالزجاج وصيانته للحفاظ على لمعانه وعمره الافتراضي." path="/maintenance" /><MainSite activeSection="maintenance" /></>} />
                <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
              </Routes>
            </BrowserRouter>
          </div>
        </ContentProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
