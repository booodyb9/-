import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { ContentProvider } from './contexts/ContentContext';
import AmbientBackground from './components/AmbientBackground';
import AnimatedRoutes from './components/AnimatedRoutes';
import ScrollToTop from './components/ScrollToTop';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import DynamicContactLinks from './components/DynamicContactLinks';
import HomepageSectionController from './components/HomepageSectionController';

const AILeadAssistant = React.lazy(() => import('./components/AILeadAssistant'));
const SmartLeadPrompt = React.lazy(() => import('./components/SmartLeadPrompt'));

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ContentProvider>
          <div className="min-h-screen bg-transparent font-sans text-right ltr:text-left relative z-0">
            <AmbientBackground />
            <BrowserRouter>
              <ScrollToTop />
              <DynamicContactLinks />
              <HomepageSectionController />
              <AnimatedRoutes />
              <FloatingWhatsApp />
              <Suspense fallback={null}>
                <AILeadAssistant />
                <SmartLeadPrompt />
              </Suspense>
            </BrowserRouter>
          </div>
        </ContentProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
