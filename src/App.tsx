/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Process from './components/Process';
import GlassVisualizer from './components/GlassVisualizer';
import ProjectStats from './components/ProjectStats';
import Features from './components/Features';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Maintenance from './components/Maintenance';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import { LanguageProvider } from './contexts/LanguageContext';
import SEO from './components/SEO';

export default function App() {
  return (
    <LanguageProvider>
      <SEO />
      <div className="min-h-screen bg-white font-sans text-right ltr:text-left">
        <Navbar />
        <main>
          <Hero />
          <Services />
          <Process />
          <GlassVisualizer />
          <ProjectStats />
          <Gallery />
          <Features />
          <Testimonials />
          <FAQ />
          <Maintenance />
          <Blog />
          <Contact />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </LanguageProvider>
  );
}
