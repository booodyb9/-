import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Loader2 as Loader2Icon, Sparkles as SparklesIcon } from 'lucide-react';
import App from './App.tsx';
import { installAdminApiAuth } from './lib/installAdminApiAuth';
import './index.css';

// PortfolioManager is legacy-generated code that references these two icon bindings
// without importing them. Expose stable bindings until that module is fully refactored.
Object.assign(globalThis, { Loader2: Loader2Icon, Sparkles: SparklesIcon });
installAdminApiAuth();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Application root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
