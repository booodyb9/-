import re

with open('src/pages/public/Home.tsx', 'r') as f:
    content = f.read()

# Make sure we use useMemo in imports
if 'useMemo' not in content:
    content = content.replace("import React, { useState, useEffect, useRef }", "import React, { useState, useEffect, useRef, useMemo }")

hook_code = """export default function Home() {
  const { getContent } = useContent();
  const portfolioContent = getContent('premium_portfolio_projects');
  const servicesContent = getContent('services_items');
  
  const projects = useMemo(() => {
    let parsed = [];
    if (portfolioContent?.body) {
      try { parsed = JSON.parse(portfolioContent.body); } catch (e) {}
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
      let cat = 'facades';
      if (p.category && p.category.includes('قواطع')) cat = 'partitions';
      if (p.category && p.category.includes('شاور')) cat = 'shower';
      if (p.category && p.category.includes('مرايا')) cat = 'mirrors';
      let span = '';
      if (i === 0) span = 'span-2';
      if (i === 1) span = 'span-row';
      return { cat, span, img: p.coverImage || p.image || 'https://wfmmedia.com/wp-content/uploads/2024/11/Modern-Glass-Facade-Architecture.webp', title: p.title, subtitle: p.category };
    });
  }, [portfolioContent]);

  const services = useMemo(() => {
    let parsed = [];
    if (servicesContent?.body) {
      try { parsed = JSON.parse(servicesContent.body); } catch(e) {}
    }
    if (!parsed || parsed.length === 0) {
      return [
        { img: 'https://wfmmedia.com/wp-content/uploads/2024/11/Modern-Glass-Facade-Architecture.webp', tag: 'FACADES', title: 'الواجهات الزجاجية', desc: 'واجهات كرتن وول واستركشر للمباني التجارية والفنادق. مقاومة الرياح والحرارة بأعلى معايير السلامة.', link: '/services/الواجهات-الزجاجية', delay: 'reveal-delay-1' },
        { img: 'https://knrslidingdoors.com/wp-content/uploads/2024/05/IMG_3277-scaled.jpg', tag: 'PARTITIONS', title: 'القواطع المكتبية', desc: 'قواطع زجاجية سيكوريت عازلة للصوت لتقسيم مساحات العمل. فعّالة ومضيئة وبتصاميم حديثة.', link: '/services/القواطع-الزجاجية', delay: 'reveal-delay-2' },
        { img: 'https://www.glassartdesign.com/wp-content/uploads/2025/05/Glass-Shower-Enclosures.jpg', tag: 'SHOWER', title: 'كبائن الشاور', desc: 'كبائن استحمام بزجاج سيكوريت 8-12 ملم مع إكسسوارات مقاومة الصدأ. مقاسات ستاندرد أو مخصصة.', link: '/services/كبائن-شاور', delay: 'reveal-delay-3' },
        { img: 'https://modernsteeldoors.com/wp-content/uploads/GLASS-ENTRANCE-DOOR-WITH-WOOD-HARDWARE-AND-SIDELIGHTS.jpg', tag: 'DOORS', title: 'الأبواب الزجاجية', desc: 'أبواب سيكوريت مفصلية وسحابة أوتوماتيكية للمداخل والمحلات التجارية والفلل.', link: '/services/أبواب-زجاجية', delay: 'reveal-delay-1' },
        { img: 'https://www.ibmirror.com/docs/240125_142731_ibmirror_mirror_led_light_min.webp', tag: 'MIRRORS', title: 'المرايا الديكورية', desc: 'مرايا ليد وديكورية بأبعاد مخصصة للصالونات والحمامات والصاليَنات. تفصيل دقيق وجودة فائقة.', link: '/services/مرايا-ذكية', delay: 'reveal-delay-2' },
        { img: 'https://www.viewrail.com/wp-content/uploads/2018/11/172A9943-scaled.jpg', tag: 'RAILINGS', title: 'الدرابزين الزجاجي', desc: 'درابزين زجاجي شفاف للسلالم والبلكونات. أنيق وآمن وبمقاسات تناسب كل تصميم معماري.', link: '/services/درابزين-زجاج', delay: 'reveal-delay-3' }
      ];
    }
    return parsed.filter(s => !s.isHidden).map((s, i) => {
      let delay = 'reveal-delay-1';
      if (i % 3 === 1) delay = 'reveal-delay-2';
      if (i % 3 === 2) delay = 'reveal-delay-3';
      return {
        img: s.image || 'https://wfmmedia.com/wp-content/uploads/2024/11/Modern-Glass-Facade-Architecture.webp',
        tag: s.title ? s.title.split(' ')[0].upper() : 'SERVICE',
        title: s.title,
        desc: s.description,
        link: `/services/${s.title.replace(/\s+/g, '-').lower()}`,
        delay
      };
    });
  }, [servicesContent]);
"""

old_hook = """export default function Home() {
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
  }, [portfolioContent]);"""

content = content.replace(old_hook, hook_code)

old_services = """        <div className="services-grid">
          {[
            { img: 'https://wfmmedia.com/wp-content/uploads/2024/11/Modern-Glass-Facade-Architecture.webp', tag: 'FACADES', title: 'الواجهات الزجاجية', desc: 'واجهات كرتن وول واستركشر للمباني التجارية والفنادق. مقاومة الرياح والحرارة بأعلى معايير السلامة.', link: '/services/الواجهات-الزجاجية', delay: 'reveal-delay-1' },
            { img: 'https://knrslidingdoors.com/wp-content/uploads/2024/05/IMG_3277-scaled.jpg', tag: 'PARTITIONS', title: 'القواطع المكتبية', desc: 'قواطع زجاجية سيكوريت عازلة للصوت لتقسيم مساحات العمل. فعّالة ومضيئة وبتصاميم حديثة.', link: '/services/القواطع-الزجاجية', delay: 'reveal-delay-2' },
            { img: 'https://www.glassartdesign.com/wp-content/uploads/2025/05/Glass-Shower-Enclosures.jpg', tag: 'SHOWER', title: 'كبائن الشاور', desc: 'كبائن استحمام بزجاج سيكوريت 8-12 ملم مع إكسسوارات مقاومة الصدأ. مقاسات ستاندرد أو مخصصة.', link: '/services/كبائن-شاور', delay: 'reveal-delay-3' },
            { img: 'https://modernsteeldoors.com/wp-content/uploads/GLASS-ENTRANCE-DOOR-WITH-WOOD-HARDWARE-AND-SIDELIGHTS.jpg', tag: 'DOORS', title: 'الأبواب الزجاجية', desc: 'أبواب سيكوريت مفصلية وسحابة أوتوماتيكية للمداخل والمحلات التجارية والفلل.', link: '/services/أبواب-زجاجية', delay: 'reveal-delay-1' },
            { img: 'https://www.ibmirror.com/docs/240125_142731_ibmirror_mirror_led_light_min.webp', tag: 'MIRRORS', title: 'المرايا الديكورية', desc: 'مرايا ليد وديكورية بأبعاد مخصصة للصالونات والحمامات والصاليَنات. تفصيل دقيق وجودة فائقة.', link: '/services/مرايا-ذكية', delay: 'reveal-delay-2' },
            { img: 'https://www.viewrail.com/wp-content/uploads/2018/11/172A9943-scaled.jpg', tag: 'RAILINGS', title: 'الدرابزين الزجاجي', desc: 'درابزين زجاجي شفاف للسلالم والبلكونات. أنيق وآمن وبمقاسات تناسب كل تصميم معماري.', link: '/services/درابزين-زجاج', delay: 'reveal-delay-3' }
          ].map((srv, idx) => ("""

new_services = """        <div className="services-grid">
          {services.map((srv, idx) => ("""

content = content.replace(old_services, new_services)

# Need to fix upper/lower to toUpperCase / toLowerCase
content = content.replace(".upper()", ".toUpperCase()")
content = content.replace(".lower()", ".toLowerCase()")

with open('src/pages/public/Home.tsx', 'w') as f:
    f.write(content)
print("Updated Home.tsx with dynamic services")
