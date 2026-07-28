import re

with open('vite.config.ts', 'r') as f:
    content = f.read()

build_opts = """
    build: {
      target: 'esnext',
      minify: 'esbuild',
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'vendor-react';
              }
              if (id.includes('framer-motion') || id.includes('motion')) {
                return 'vendor-motion';
              }
              if (id.includes('swiper')) {
                return 'vendor-swiper';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              return 'vendor';
            }
          },
        },
      },
    },
"""

if 'build:' not in content:
    content = content.replace('server:', build_opts + '    server:')

with open('vite.config.ts', 'w') as f:
    f.write(content)
