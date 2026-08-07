import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Loader2 as Loader2Icon, Sparkles as SparklesIcon } from 'lucide-react';
import App from './App.tsx';
import './index.css';

// PortfolioManager is legacy-generated code that references these two icon bindings
// without importing them. Expose stable bindings until that module is fully refactored.
Object.assign(globalThis, { Loader2: Loader2Icon, Sparkles: SparklesIcon });

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
