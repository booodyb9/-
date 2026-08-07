content = open('vite.config.ts').read()
content = content.replace("      rollupOptions: {\n      },", """      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'vendor-react';
              }
              if (id.includes('@supabase')) {
                return 'vendor-supabase';
              }
              if (id.includes('framer-motion') || id.includes('motion')) {
                return 'vendor-motion';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('react-quill') || id.includes('quill')) {
                return 'vendor-quill';
              }
              if (id.includes('dnd')) {
                return 'vendor-dnd';
              }
              return 'vendor';
            }
          }
        }
      },""")
open('vite.config.ts', 'w').write(content)
