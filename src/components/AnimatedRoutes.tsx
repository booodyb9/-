import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';

import AdminRoute from './AdminRoute';

const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Home = React.lazy(() => import('../pages/public/Home'));
const About = React.lazy(() => import('../pages/public/About'));
const ServicesPage = React.lazy(() => import('../pages/public/ServicesPage'));
const ServiceDetails = React.lazy(() => import('../pages/public/ServiceDetails'));
const Portfolio = React.lazy(() => import('../pages/public/Portfolio'));
const ProjectDetails = React.lazy(() => import('../pages/public/ProjectDetails'));
const BlogPage = React.lazy(() => import('../pages/public/BlogPage'));
const BlogDetails = React.lazy(() => import('../pages/public/BlogDetails'));
const FAQPage = React.lazy(() => import('../pages/public/FAQPage'));
const TestimonialsPage = React.lazy(() => import('../pages/public/TestimonialsPage'));
const ContactPage = React.lazy(() => import('../pages/public/ContactPage'));
const RequestQuote = React.lazy(() => import('../pages/public/RequestQuote'));
const SearchPage = React.lazy(() => import('../pages/public/SearchPage'));
const PrivacyPolicy = React.lazy(() => import('../pages/public/PrivacyPolicy'));
const Terms = React.lazy(() => import('../pages/public/Terms'));
const NotFound = React.lazy(() => import('../pages/public/NotFound'));
const SitemapPage = React.lazy(() => import('../pages/public/SitemapPage'));
const DynamicPage = React.lazy(() => import('../pages/public/DynamicPage'));

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center" role="status" aria-label="جاري تحميل الصفحة">
      <div className="w-12 h-12 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<RouteFallback />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/services" element={<PageWrapper><ServicesPage /></PageWrapper>} />
          <Route path="/services/:slug" element={<PageWrapper><ServiceDetails /></PageWrapper>} />
          <Route path="/portfolio" element={<PageWrapper><Portfolio /></PageWrapper>} />
          <Route path="/portfolio/:slug" element={<PageWrapper><ProjectDetails /></PageWrapper>} />
          <Route path="/blog" element={<PageWrapper><BlogPage /></PageWrapper>} />
          <Route path="/blog/:slug" element={<PageWrapper><BlogDetails /></PageWrapper>} />
          <Route path="/faq" element={<PageWrapper><FAQPage /></PageWrapper>} />
          <Route path="/testimonials" element={<PageWrapper><TestimonialsPage /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
          <Route path="/request-quote" element={<PageWrapper><RequestQuote /></PageWrapper>} />
          <Route path="/search" element={<PageWrapper><SearchPage /></PageWrapper>} />
          <Route path="/sitemap" element={<PageWrapper><SitemapPage /></PageWrapper>} />
          <Route path="/privacy-policy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
          <Route path="/terms" element={<PageWrapper><Terms /></PageWrapper>} />
          <Route path="/dashboard/*" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/:slug" element={<PageWrapper><DynamicPage /></PageWrapper>} />
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
