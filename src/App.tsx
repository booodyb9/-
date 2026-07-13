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
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { ContentProvider } from './contexts/ContentContext';
import SEO from './components/SEO';
import Dashboard from './pages/Dashboard';
import AdminRoute from './components/AdminRoute';

function MainSite() {
  return (
    <>
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
          <SEO />
          <div className="min-h-screen bg-white font-sans text-right ltr:text-left">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<MainSite />} />
                <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
              </Routes>
            </BrowserRouter>
          </div>
        </ContentProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
