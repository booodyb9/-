import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { ContentProvider } from './contexts/ContentContext';
import AdminRoute from './components/AdminRoute';
import Dashboard from './pages/Dashboard';
import AmbientBackground from './components/AmbientBackground';

const Home = React.lazy(() => import('./pages/public/Home'));
const About = React.lazy(() => import('./pages/public/About'));
const ServicesPage = React.lazy(() => import('./pages/public/ServicesPage'));
const ServiceDetails = React.lazy(() => import('./pages/public/ServiceDetails'));
const Portfolio = React.lazy(() => import('./pages/public/Portfolio'));
const ProjectDetails = React.lazy(() => import('./pages/public/ProjectDetails'));
const BlogPage = React.lazy(() => import('./pages/public/BlogPage'));
const BlogDetails = React.lazy(() => import('./pages/public/BlogDetails'));
const FAQPage = React.lazy(() => import('./pages/public/FAQPage'));
const TestimonialsPage = React.lazy(() => import('./pages/public/TestimonialsPage'));
const ContactPage = React.lazy(() => import('./pages/public/ContactPage'));
const RequestQuote = React.lazy(() => import('./pages/public/RequestQuote'));
const SearchPage = React.lazy(() => import('./pages/public/SearchPage'));
const PrivacyPolicy = React.lazy(() => import('./pages/public/PrivacyPolicy'));
const Terms = React.lazy(() => import('./pages/public/Terms'));
const NotFound = React.lazy(() => import('./pages/public/NotFound'));
const DynamicPage = React.lazy(() => import('./pages/public/DynamicPage'));

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ContentProvider>
          <div className="min-h-screen bg-transparent font-sans text-right ltr:text-left relative z-0">
            <AmbientBackground />
            <BrowserRouter>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin"></div></div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/services/:slug" element={<ServiceDetails />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/portfolio/:slug" element={<ProjectDetails />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogDetails />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/testimonials" element={<TestimonialsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/request-quote" element={<RequestQuote />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                
                <Route path="/dashboard/*" element={<AdminRoute><Dashboard /></AdminRoute>} />
                
                <Route path="/:slug" element={<DynamicPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
            </BrowserRouter>
          </div>
        </ContentProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
