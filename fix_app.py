with open('src/App.tsx', 'r') as f:
    content = f.read()

if 'import FloatingWhatsApp' not in content:
    content = content.replace("import ScrollToTop from './components/ScrollToTop';", "import ScrollToTop from './components/ScrollToTop';\nimport FloatingWhatsApp from './components/FloatingWhatsApp';")
    content = content.replace("<AnimatedRoutes />", "<AnimatedRoutes />\n              <FloatingWhatsApp />")

    with open('src/App.tsx', 'w') as f:
        f.write(content)
