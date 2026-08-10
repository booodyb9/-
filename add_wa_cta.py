import re

files = ['src/pages/public/BlogDetails.tsx', 'src/pages/public/ServiceDetails.tsx', 'src/pages/public/ProjectDetails.tsx']

for file in files:
    with open(file, 'r') as f:
        content = f.read()
    
    if "WhatsAppInlineCTA" not in content:
        # Import WhatsAppInlineCTA
        content = content.replace("import { Link, useParams } from 'react-router-dom';", "import { Link, useParams } from 'react-router-dom';\nimport WhatsAppInlineCTA from '../../components/WhatsAppInlineCTA';")
        content = content.replace("import Footer from '../../components/Footer';", "import Footer from '../../components/Footer';\nimport WhatsAppInlineCTA from '../../components/WhatsAppInlineCTA';")
        
        # Determine the insertion point and message
        if "BlogDetails.tsx" in file:
            target = '<div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">'
            message = "مرحباً، أود الاستفسار بخصوص المقال: ${post.title}"
            insertion = f"                        <WhatsAppInlineCTA message={{`مرحباً، أود الاستفسار بخصوص المقال: ${{post.title}}`}} />\n\n                        <div className=\"mt-12 pt-8 border-t border-gray-100 flex justify-between items-center\">"
            content = content.replace(target, insertion)
            
        elif "ServiceDetails.tsx" in file:
            target = '<div className="mt-12">'
            message = "مرحباً، أود الاستفسار عن خدمة: ${service.title}"
            insertion = f"                        <WhatsAppInlineCTA message={{`مرحباً، أود الاستفسار عن خدمة: ${{service.title}}`}} />\n\n                        <div className=\"mt-12\">"
            content = content.replace(target, insertion)
            
        elif "ProjectDetails.tsx" in file:
            target = '<div className="mt-12 pt-12 border-t border-gray-100">'
            message = "مرحباً، أود الاستفسار بخصوص مشروع: ${project.title}"
            insertion = f"                        <WhatsAppInlineCTA message={{`مرحباً، أود الاستفسار بخصوص مشروع: ${{project.title}}`}} />\n\n                        <div className=\"mt-12 pt-12 border-t border-gray-100\">"
            content = content.replace(target, insertion)
            
        with open(file, 'w') as f:
            f.write(content)
        print(f"Updated {file}")
