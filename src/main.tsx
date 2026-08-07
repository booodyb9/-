import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Application root element was not found.');
}

// Stamp the production shell so Vite emits a fresh entry chunk after emergency rollback.
rootElement.dataset.buildRevision = 'stable-2026-08-07-1';

createRoot(rootElement).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
