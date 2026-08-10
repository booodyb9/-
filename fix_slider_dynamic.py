import re

with open('src/components/GallerySlider.tsx', 'r') as f:
    content = f.read()

if 'useContent' not in content:
    content = content.replace("import React from 'react';", "import React, { useMemo } from 'react';\nimport { useContent } from '../contexts/ContentContext';")
    
    hook_code = """export default function GallerySlider() {
  const { getContent } = useContent();
  const portfolioContent = getContent('premium_portfolio_projects');
  
  const slides = useMemo(() => {
    let parsed = [];
    if (portfolioContent?.body) {
      try {
        parsed = JSON.parse(portfolioContent.body);
      } catch (e) {}
    }
    
    if (!parsed || parsed.length === 0) {
      return [
        {
          img: 'https://wfmmedia.com/wp-content/uploads/2024/11/Modern-Glass-Facade-Architecture.webp',
          title: 'واجهات أبراج الرياض',
          subtitle: 'FACADES'
        },
        {
          img: 'https://knrslidingdoors.com/wp-content/uploads/2024/05/IMG_3277-scaled.jpg',
          title: 'قواطع مكتبية عازلة',
          subtitle: 'PARTITIONS'
        },
        {
          img: 'https://www.glassartdesign.com/wp-content/uploads/2025/05/Glass-Shower-Enclosures.jpg',
          title: 'شاور بوكس فاخر',
          subtitle: 'SHOWER'
        },
        {
          img: 'https://glassenterprises.com/wp-content/uploads/2022/11/modern-buildings-with-glass-facade-1024x1024.jpg',
          title: 'واجهات بانورامية',
          subtitle: 'FACADES'
        },
        {
          img: 'https://www.viewrail.com/wp-content/uploads/2018/11/172A9943-scaled.jpg',
          title: 'درابزين زجاجي للسلم',
          subtitle: 'RAILINGS'
        }
      ];
    }
    
    return parsed.filter(p => !p.isHidden).slice(0, 8).map(p => ({
      img: p.coverImage || p.image || 'https://wfmmedia.com/wp-content/uploads/2024/11/Modern-Glass-Facade-Architecture.webp',
      title: p.title,
      subtitle: p.category || 'PROJECT'
    }));
  }, [portfolioContent]);"""
    
    old_slides = """export default function GallerySlider() {
  const slides = [
    {
      img: 'https://wfmmedia.com/wp-content/uploads/2024/11/Modern-Glass-Facade-Architecture.webp',
      title: 'واجهات أبراج الرياض',
      subtitle: 'FACADES'
    },
    {
      img: 'https://knrslidingdoors.com/wp-content/uploads/2024/05/IMG_3277-scaled.jpg',
      title: 'قواطع مكتبية عازلة',
      subtitle: 'PARTITIONS'
    },
    {
      img: 'https://www.glassartdesign.com/wp-content/uploads/2025/05/Glass-Shower-Enclosures.jpg',
      title: 'شاور بوكس فاخر',
      subtitle: 'SHOWER'
    },
    {
      img: 'https://glassenterprises.com/wp-content/uploads/2022/11/modern-buildings-with-glass-facade-1024x1024.jpg',
      title: 'واجهات بانورامية',
      subtitle: 'FACADES'
    },
    {
      img: 'https://www.viewrail.com/wp-content/uploads/2018/11/172A9943-scaled.jpg',
      title: 'درابزين زجاجي للسلم',
      subtitle: 'RAILINGS'
    }
  ];"""
    
    content = content.replace(old_slides, hook_code)
    
    with open('src/components/GallerySlider.tsx', 'w') as f:
        f.write(content)

print("Updated GallerySlider.tsx with dynamic portfolio")
