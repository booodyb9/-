import re

with open('src/pages/public/Home.tsx', 'r') as f:
    content = f.read()

if 'import { useContent }' not in content:
    content = content.replace("import React, { useState, useEffect, useRef } from 'react';", "import React, { useState, useEffect, useRef, useMemo } from 'react';\nimport { useContent } from '../../contexts/ContentContext';")

# Add the hook usage inside the Home component
# find `export default function Home() {`
hook_code = """export default function Home() {
  const { getContent } = useContent();
  const portfolioContent = getContent('premium_portfolio_projects');
  
  const projects = useMemo(() => {
    let parsed = [];
    if (portfolioContent?.body) {
      try {
        parsed = JSON.parse(portfolioContent.body);
      } catch (e) {}
    }
    
    if (!parsed || parsed.length === 0) {
      return [
        { cat: 'facades', span: 'span-2', img: 'https://wfmmedia.com/wp-content/uploads/2024/11/Modern-Glass-Facade-Architecture.webp', title: 'واجهة برج الأعمال المركزي — العليا', subtitle: 'FACADES · الرياض 2024' },
        { cat: 'partitions', span: 'span-row', img: 'https://knrslidingdoors.com/wp-content/uploads/2024/05/IMG_3277-scaled.jpg', title: 'قواطع مكتب شركة التقنية', subtitle: 'PARTITIONS · الدمام' },
        { cat: 'shower', span: '', img: 'https://www.glassartdesign.com/wp-content/uploads/2025/05/Glass-Shower-Enclosures.jpg', title: 'كبائن فيلا المحمدية الفاخرة', subtitle: 'SHOWER · جدة' },
        { cat: 'facades', span: '', img: 'https://glassenterprises.com/wp-content/uploads/2022/11/modern-buildings-with-glass-facade-1024x1024.jpg', title: 'واجهة المجمع التجاري الذهبي', subtitle: 'FACADES · مكة المكرمة' },
        { cat: 'mirrors', span: '', img: 'https://www.ibmirror.com/docs/240125_142731_ibmirror_mirror_led_light_min.webp', title: 'مرايا ليد — صالون راقٍ', subtitle: 'MIRRORS · الرياض' },
        { cat: 'partitions', span: '', img: 'https://www.viewrail.com/wp-content/uploads/2018/11/172A9943-scaled.jpg', title: 'درابزين زجاجي — فيلا النخيل', subtitle: 'RAILINGS · الرياض' }
      ];
    }
    
    return parsed.filter(p => !p.isHidden).map((p, i) => {
      // Map category to cat enum
      let cat = 'facades';
      if (p.category && p.category.includes('قواطع')) cat = 'partitions';
      if (p.category && p.category.includes('شاور')) cat = 'shower';
      if (p.category && p.category.includes('مرايا')) cat = 'mirrors';
      
      let span = '';
      if (i === 0) span = 'span-2';
      if (i === 1) span = 'span-row';
      
      return {
        cat,
        span,
        img: p.coverImage || p.image || 'https://wfmmedia.com/wp-content/uploads/2024/11/Modern-Glass-Facade-Architecture.webp',
        title: p.title,
        subtitle: p.category
      };
    });
  }, [portfolioContent]);
"""

if "const portfolioContent =" not in content:
    content = content.replace("export default function Home() {", hook_code)

old_gallery = """          <div className="gallery-grid reveal">
            {[
              { cat: 'facades', span: 'span-2', img: 'https://wfmmedia.com/wp-content/uploads/2024/11/Modern-Glass-Facade-Architecture.webp', title: 'واجهة برج الأعمال المركزي — العليا', subtitle: 'FACADES · الرياض 2024' },
              { cat: 'partitions', span: 'span-row', img: 'https://knrslidingdoors.com/wp-content/uploads/2024/05/IMG_3277-scaled.jpg', title: 'قواطع مكتب شركة التقنية', subtitle: 'PARTITIONS · الدمام' },
              { cat: 'shower', span: '', img: 'https://www.glassartdesign.com/wp-content/uploads/2025/05/Glass-Shower-Enclosures.jpg', title: 'كبائن فيلا المحمدية الفاخرة', subtitle: 'SHOWER · جدة' },
              { cat: 'facades', span: '', img: 'https://glassenterprises.com/wp-content/uploads/2022/11/modern-buildings-with-glass-facade-1024x1024.jpg', title: 'واجهة المجمع التجاري الذهبي', subtitle: 'FACADES · مكة المكرمة' },
              { cat: 'mirrors', span: '', img: 'https://www.ibmirror.com/docs/240125_142731_ibmirror_mirror_led_light_min.webp', title: 'مرايا ليد — صالون راقٍ', subtitle: 'MIRRORS · الرياض' },
              { cat: 'partitions', span: '', img: 'https://www.viewrail.com/wp-content/uploads/2018/11/172A9943-scaled.jpg', title: 'درابزين زجاجي — فيلا النخيل', subtitle: 'RAILINGS · الرياض' }
            ].map((g, i) => ("""

new_gallery = """          <div className="gallery-grid reveal">
            {projects.map((g, i) => ("""

content = content.replace(old_gallery, new_gallery)

with open('src/pages/public/Home.tsx', 'w') as f:
    f.write(content)
print("Updated Home.tsx with dynamic portfolio")
