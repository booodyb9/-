import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { ContentProvider } from './contexts/ContentContext';
import AmbientBackground from './components/AmbientBackground';
import AnimatedRoutes from './components/AnimatedRoutes';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ContentProvider>
          <div className="min-h-screen bg-transparent font-sans text-right ltr:text-left relative z-0">
            <AmbientBackground />
            <BrowserRouter>
              <ScrollToTop />
              <AnimatedRoutes />
            </BrowserRouter>
          </div>
        </ContentProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
