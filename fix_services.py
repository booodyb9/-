import re

with open('src/pages/public/Home.tsx', 'r') as f:
    content = f.read()

old_services = """    if (!parsed || parsed.length === 0) {
      return [
        { img: 'https://wfmmedia.com/wp-content/uploads/2024/11/Modern-Glass-Facade-Architecture.webp', tag: 'FACADES', title: 'الواجهات الزجاجية', desc: 'واجهات كرتن وول واستركشر للمباني التجارية والفنادق. مقاومة الرياح والحرارة بأعلى معايير السلامة.', link: '/services/الواجهات-الزجاجية', delay: 'reveal-delay-1' },
        { img: 'https://knrslidingdoors.com/wp-content/uploads/2024/05/IMG_3277-scaled.jpg', tag: 'PARTITIONS', title: 'القواطع المكتبية', desc: 'قواطع زجاجية سيكوريت عازلة للصوت لتقسيم مساحات العمل. فعّالة ومضيئة وبتصاميم حديثة.', link: '/services/القواطع-الزجاجية', delay: 'reveal-delay-2' },
        { img: 'https://www.glassartdesign.com/wp-content/uploads/2025/05/Glass-Shower-Enclosures.jpg', tag: 'SHOWER', title: 'كبائن الشاور', desc: 'كبائن استحمام بزجاج سيكوريت 8-12 ملم مع إكسسوارات مقاومة الصدأ. مقاسات ستاندرد أو مخصصة.', link: '/services/كبائن-شاور', delay: 'reveal-delay-3' },
        { img: 'https://modernsteeldoors.com/wp-content/uploads/GLASS-ENTRANCE-DOOR-WITH-WOOD-HARDWARE-AND-SIDELIGHTS.jpg', tag: 'DOORS', title: 'الأبواب الزجاجية', desc: 'أبواب سيكوريت مفصلية وسحابة أوتوماتيكية للمداخل والمحلات التجارية والفلل.', link: '/services/أبواب-زجاجية', delay: 'reveal-delay-1' },
        { img: 'https://www.ibmirror.com/docs/240125_142731_ibmirror_mirror_led_light_min.webp', tag: 'MIRRORS', title: 'المرايا الديكورية', desc: 'مرايا ليد وديكورية بأبعاد مخصصة للصالونات والحمامات والصاليَنات. تفصيل دقيق وجودة فائقة.', link: '/services/مرايا-ذكية', delay: 'reveal-delay-2' },
        { img: 'https://www.viewrail.com/wp-content/uploads/2018/11/172A9943-scaled.jpg', tag: 'RAILINGS', title: 'الدرابزين الزجاجي', desc: 'درابزين زجاجي شفاف للسلالم والبلكونات. أنيق وآمن وبمقاسات تناسب كل تصميم معماري.', link: '/services/درابزين-زجاج', delay: 'reveal-delay-3' }
      ];
    }"""

new_services = """    if (!parsed || parsed.length === 0) {
      return [
        { img: 'https://ugvdoabczcnxluzxehga.supabase.co/storage/v1/object/public/media/516d5831-d7a5-4cf4-aee2-83774df3f590.jpg', tag: 'FACADES', title: 'الواجهات الزجاجية', desc: 'واجهات كرتن وول واستركشر للمباني التجارية والفنادق. مقاومة الرياح والحرارة بأعلى معايير السلامة.', link: '/services/الواجهات-الزجاجية', delay: 'reveal-delay-1' },
        { img: 'https://ugvdoabczcnxluzxehga.supabase.co/storage/v1/object/public/media/47c05967-1abd-4b26-900a-f0c97e88ce2b.jpg', tag: 'PARTITIONS', title: 'القواطع المكتبية', desc: 'قواطع زجاجية سيكوريت عازلة للصوت لتقسيم مساحات العمل. فعّالة ومضيئة وبتصاميم حديثة.', link: '/services/القواطع-الزجاجية', delay: 'reveal-delay-2' },
        { img: 'https://ugvdoabczcnxluzxehga.supabase.co/storage/v1/object/public/media/portfolio/covers/4f1aa8fe-6836-431f-92a6-00c06985a988.webp', tag: 'SHOWER', title: 'كبائن الشاور', desc: 'كبائن استحمام بزجاج سيكوريت 8-12 ملم مع إكسسوارات مقاومة الصدأ. مقاسات ستاندرد أو مخصصة.', link: '/services/كبائن-شاور', delay: 'reveal-delay-3' },
        { img: 'https://ugvdoabczcnxluzxehga.supabase.co/storage/v1/object/public/media/e9fd27f9-f786-474c-af76-2021bc8db88d.png', tag: 'DOORS', title: 'الأبواب الزجاجية', desc: 'أبواب سيكوريت مفصلية وسحابة أوتوماتيكية للمداخل والمحلات التجارية والفلل.', link: '/services/أبواب-زجاجية', delay: 'reveal-delay-1' },
        { img: 'https://www.ibmirror.com/docs/240125_142731_ibmirror_mirror_led_light_min.webp', tag: 'MIRRORS', title: 'المرايا الديكورية', desc: 'مرايا ليد وديكورية بأبعاد مخصصة للصالونات والحمامات والصالات. تفصيل دقيق وجودة فائقة.', link: '/services/مرايا-ذكية', delay: 'reveal-delay-2' },
        { img: 'https://www.viewrail.com/wp-content/uploads/2018/11/172A9943-scaled.jpg', tag: 'RAILINGS', title: 'الدرابزين الزجاجي', desc: 'درابزين زجاجي شفاف للسلالم والبلكونات. أنيق وآمن وبمقاسات تناسب كل تصميم معماري.', link: '/services/درابزين-زجاج', delay: 'reveal-delay-3' }
      ];
    }"""

if old_services in content:
    content = content.replace(old_services, new_services)
    with open('src/pages/public/Home.tsx', 'w') as f:
        f.write(content)
    print("Updated services images")
else:
    print("Not found old_services")

