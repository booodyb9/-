import re

files_to_update = [
    'src/pages/public/ServicesPage.tsx',
    'src/pages/public/Portfolio.tsx',
    'src/pages/public/TestimonialsPage.tsx',
    'src/pages/public/About.tsx',
    'src/pages/public/BlogPage.tsx',
]

for file_path in files_to_update:
    try:
        with open(file_path, 'r') as f:
            content = f.read()
        
        if "SectionCTA" not in content:
            content = content.replace("import Footer from '../../components/Footer';", "import Footer from '../../components/Footer';\nimport SectionCTA from '../../components/SectionCTA';")
            content = content.replace("</main>", '  <div className="py-12 bg-white border-t border-gray-100"><SectionCTA /></div>\n      </main>')
            
            with open(file_path, 'w') as f:
                f.write(content)
            print(f"Updated {file_path}")
    except Exception as e:
        print(f"Failed {file_path}: {e}")

