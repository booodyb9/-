
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import GallerySlider from '../../components/GallerySlider';
import Blog from '../../components/Blog';
import SectionCTA from '../../components/SectionCTA';
import Footer from '../../components/Footer';

export default function Home() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [calcArea, setCalcArea] = useState<number | ''>('');
  const [calcType, setCalcType] = useState('سيكوريت عادي');
  const [calcExtras, setCalcExtras] = useState({
    professional: true,
    luxury: false,
    delivery: false
  });
  
  const [calcResult, setCalcResult] = useState({ total: 0, low: 0, high: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState({ text: '', isError: false });
  const [showBackTop, setShowBackTop] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowBackTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Scroll Reveal
    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => revealObs.observe(el));
    
    // Counters
    const counters = document.querySelectorAll('[data-target]');
    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        const target = parseInt(el.dataset.target || '0');
        const suffix = el.textContent?.replace(/[0-9]/g, '') || '';
        const duration = 2000;
        const startTime = performance.now();
        function update(now: number) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        counterObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObs.observe(c));
    
    return () => {
      revealObs.disconnect();
      counterObs.disconnect();
    };
  }, []);

  const [activeFilter, setActiveFilter] = useState('all');
  
  const toggleFaq = (e: React.MouseEvent) => {
    const item = (e.currentTarget as HTMLElement).closest('.faq-item');
    if (!item) return;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  };

  useEffect(() => {
    const area = Number(calcArea) || 0;
    let typePrice = 0;
    if (calcType === 'سيكوريت عادي') typePrice = 350;
    if (calcType === 'سيكوريت مزدوج') typePrice = 550;
    if (calcType === 'ملون ديكوري') typePrice = 450;
    if (calcType === 'ذكي/تشارك') typePrice = 800;
    
    let extrasPrice = 0;
    if (calcExtras.professional) extrasPrice += 80;
    if (calcExtras.luxury) extrasPrice += 50;
    if (calcExtras.delivery) extrasPrice += 30;
    
    const unitPrice = typePrice + extrasPrice;
    const total = area * unitPrice;
    
    setCalcResult({
      total,
      low: Math.round(total * 0.9),
      high: Math.round(total * 1.15)
    });
  }, [calcArea, calcType, calcExtras]);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    const nameInput = formRef.current.querySelector<HTMLInputElement>('.form-input[type="text"]');
    const phoneInput = formRef.current.querySelector<HTMLInputElement>('.form-input[type="tel"]');
    const serviceSelect = formRef.current.querySelector<HTMLSelectElement>('.form-select');
    const messageInput = formRef.current.querySelector<HTMLTextAreaElement>('.form-textarea');
    
    const name = nameInput?.value.trim() || '';
    const phone = phoneInput?.value.trim() || '';
    const service = serviceSelect?.value || '';
    const message = messageInput?.value.trim() || '';
    
    if (!name || !phone) {
      setToastMsg({ text: 'يرجى إدخال الاسم ورقم الجوال على الأقل.', isError: true });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('leads').insert([{
        name,
        phone,
        service: service || null,
        message: message || null,
        calc_area: calcArea || null,
        calc_type: calcType || null,
        calc_price: calcResult.total || null,
        source: 'website'
      }]);
      
      if (error) throw error;
      
      setToastMsg({ text: 'تم إرسال طلبك بنجاح! سنتواصل معك خلال 24 ساعة.', isError: false });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
      
      if (nameInput) nameInput.value = '';
      if (phoneInput) phoneInput.value = '';
      if (serviceSelect) serviceSelect.value = '';
      if (messageInput) messageInput.value = '';
    } catch (err) {
      console.error(err);
      setToastMsg({ text: 'حدث خطأ أثناء الإرسال. تواصل معنا مباشرة عبر واتساب.', isError: true });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollTo = (id: string) => {
    setIsMobileNavOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <SEO title="زجاج الرياض | حلول زجاجية فاخرة" description="شركة زجاج الرياض لتركيب الواجهات والقواطع الزجاجية." />
      
      <Navbar />

      <Hero />

      <section id="stats">
        <div className="stats-grid container reveal">
          <div className="stat-item">
            <div className="stat-number" data-target="500">0+</div>
            <div className="stat-label">مشروع منجز بنجاح</div>
          </div>
          <div className="stat-item">
            <div className="stat-number" data-target="15">0</div>
            <div className="stat-label">سنة من الخبرة المتراكمة</div>
          </div>
          <div className="stat-item">
            <div className="stat-number" data-target="200">0+</div>
            <div className="stat-label">عميل راضٍ في الرياض</div>
          </div>
          <div className="stat-item">
            <div className="stat-number" data-target="10">0</div>
            <div className="stat-label">سنوات ضمان شامل</div>
          </div>
        </div>
      </section>

      <section id="services">
        <div className="section-header reveal">
          <div className="section-tag">SERVICES · خدماتنا</div>
          <h2 className="section-h2">حلول زجاجية لكل احتياج</h2>
          <p className="section-desc">من الواجهات الشاهقة إلى تفاصيل الحمام — نغطي كل ما يتعلق بالزجاج في مشروعك</p>
        </div>

        <div className="services-grid">
          {[
            { img: 'https://wfmmedia.com/wp-content/uploads/2024/11/Modern-Glass-Facade-Architecture.webp', tag: 'FACADES', title: 'الواجهات الزجاجية', desc: 'واجهات كرتن وول واستركشر للمباني التجارية والفنادق. مقاومة الرياح والحرارة بأعلى معايير السلامة.', link: '/services/الواجهات-الزجاجية', delay: 'reveal-delay-1' },
            { img: 'https://knrslidingdoors.com/wp-content/uploads/2024/05/IMG_3277-scaled.jpg', tag: 'PARTITIONS', title: 'القواطع المكتبية', desc: 'قواطع زجاجية سيكوريت عازلة للصوت لتقسيم مساحات العمل. فعّالة ومضيئة وبتصاميم حديثة.', link: '/services/القواطع-الزجاجية', delay: 'reveal-delay-2' },
            { img: 'https://www.glassartdesign.com/wp-content/uploads/2025/05/Glass-Shower-Enclosures.jpg', tag: 'SHOWER', title: 'كبائن الشاور', desc: 'كبائن استحمام بزجاج سيكوريت 8-12 ملم مع إكسسوارات مقاومة الصدأ. مقاسات ستاندرد أو مخصصة.', link: '/services/كبائن-شاور', delay: 'reveal-delay-3' },
            { img: 'https://modernsteeldoors.com/wp-content/uploads/GLASS-ENTRANCE-DOOR-WITH-WOOD-HARDWARE-AND-SIDELIGHTS.jpg', tag: 'DOORS', title: 'الأبواب الزجاجية', desc: 'أبواب سيكوريت مفصلية وسحابة أوتوماتيكية للمداخل والمحلات التجارية والفلل.', link: '/services/أبواب-زجاجية', delay: 'reveal-delay-1' },
            { img: 'https://www.ibmirror.com/docs/240125_142731_ibmirror_mirror_led_light_min.webp', tag: 'MIRRORS', title: 'المرايا الديكورية', desc: 'مرايا ليد وديكورية بأبعاد مخصصة للصالونات والحمامات والصاليَنات. تفصيل دقيق وجودة فائقة.', link: '/services/مرايا-ذكية', delay: 'reveal-delay-2' },
            { img: 'https://www.viewrail.com/wp-content/uploads/2018/11/172A9943-scaled.jpg', tag: 'RAILINGS', title: 'الدرابزين الزجاجي', desc: 'درابزين زجاجي شفاف للسلالم والبلكونات. أنيق وآمن وبمقاسات تناسب كل تصميم معماري.', link: '/services/درابزين-زجاج', delay: 'reveal-delay-3' }
          ].map((srv, idx) => (
            <Link to={srv.link} key={idx} className={`service-card reveal ${srv.delay}`}>
              <div className="service-img" style={{backgroundImage:`url('${srv.img}')`}}>
                <span className="service-img-tag">{srv.tag}</span>
              </div>
              <div className="service-body">
                <div className="service-name">{srv.title}</div>
                <p className="service-desc">{srv.desc}</p>
                <div className="service-link">
                  عرض التفاصيل
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="calc-strip reveal">
          <div className="calc-strip-text">
            <div className="calc-strip-title">احسب تكلفة مشروعك الآن 🧮</div>
            <div className="calc-strip-desc">أدخل المساحة ونوع الزجاج — واحصل على تقدير فوري لميزانيتك</div>
          </div>
          <button className="btn btn-light" onClick={() => setIsCalcOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            جرّب الحاسبة المجانية
          </button>
        </div>
      </section>
      <div className="py-8 bg-gray-50"><SectionCTA /></div>

      <section id="why">
        <div className="why-inner container">
          <div>
            <div className="section-tag reveal">WHY US · لماذا نحن</div>
            <h2 className="section-h2 reveal reveal-delay-1">شريكك الموثوق منذ 15 عاماً</h2>
            <p className="section-desc reveal reveal-delay-2" style={{marginBottom:'var(--space-10)'}}>لا نكتفي بتركيب الزجاج — نصنع تجربة بصرية تدوم. فريقنا يجمع بين الحرفية والتكنولوجيا لنتائج تفوق التوقعات.</p>

            <div className="why-features">
              {[
                { title: 'جودة مضمونة 10 سنوات', desc: 'نضمن كل مشروع ننفذه لمدة عشر سنوات كاملة — المواد والتركيب والإكسسوارات.', icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>, delay: 'reveal-delay-1' },
                { title: 'التسليم في الوقت المحدد', desc: 'نلتزم بالجداول الزمنية المتفق عليها. 98% من مشاريعنا تُسلَّم قبل الموعد أو في وقته.', icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>, delay: 'reveal-delay-2' },
                { title: 'فريق فني مرخّص ومعتمد', desc: 'مهندسون وفنيون سعوديون بخبرة عملية تتجاوز 15 عاماً في أكبر مشاريع الرياض.', icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>, delay: 'reveal-delay-3' },
                { title: 'أسعار تنافسية وشفافة', desc: 'بدون رسوم مخفية. تسعيرة واضحة ومفصّلة قبل بدء أي عمل، مع إمكانية التفاوض.', icon: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>, delay: 'reveal-delay-4' }
              ].map((ft, i) => (
                <div key={i} className={`feature-item reveal ${ft.delay}`}>
                  <div className="feature-icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{ft.icon}</svg>
                  </div>
                  <div>
                    <div className="feature-title">{ft.title}</div>
                    <div className="feature-desc">{ft.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="why-image reveal reveal-delay-2">
            <div className="why-img-card">
              <img loading="lazy" decoding="async" src="https://images.stockcake.com/public/4/6/3/463ccf5d-b90d-4323-b34b-642ce5f2261c_large/luminous-glass-architecture-stockcake.jpg" alt="أعمال زجاجية فاخرة" />
              <div className="why-overlay-stat pos-top-left" style={{top:24, right: -20, left: 'auto'}}>
                <div className="why-stat-big">+500</div>
                <div className="why-stat-label">مشروع ناجح</div>
              </div>
              <div className="why-overlay-stat pos-bottom-right" style={{bottom: 40, left: -20, right: 'auto'}}>
                <div className="why-stat-big">100%</div>
                <div className="why-stat-label">رضا العملاء</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery">
        <div className="gallery-inner">
          <div className="section-header reveal">
            <div className="section-tag">PORTFOLIO · معرض الأعمال</div>
            <h2 className="section-h2">مشاريع نفتخر بتنفيذها</h2>
            <p className="section-desc">تصفح مجموعة من أعمالنا الأخيرة في مختلف أنواع مشاريع الزجاج</p>
          </div>

          <div className="filter-tabs reveal">
            <button className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>الكل</button>
            <button className={`filter-tab ${activeFilter === 'facades' ? 'active' : ''}`} onClick={() => setActiveFilter('facades')}>الواجهات</button>
            <button className={`filter-tab ${activeFilter === 'partitions' ? 'active' : ''}`} onClick={() => setActiveFilter('partitions')}>القواطع</button>
            <button className={`filter-tab ${activeFilter === 'shower' ? 'active' : ''}`} onClick={() => setActiveFilter('shower')}>كبائن شاور</button>
            <button className={`filter-tab ${activeFilter === 'mirrors' ? 'active' : ''}`} onClick={() => setActiveFilter('mirrors')}>المرايا</button>
          </div>

          <div className="gallery-grid reveal">
            {[
              { cat: 'facades', span: 'span-2', img: 'https://wfmmedia.com/wp-content/uploads/2024/11/Modern-Glass-Facade-Architecture.webp', title: 'واجهة برج الأعمال المركزي — العليا', subtitle: 'FACADES · الرياض 2024' },
              { cat: 'partitions', span: 'span-row', img: 'https://knrslidingdoors.com/wp-content/uploads/2024/05/IMG_3277-scaled.jpg', title: 'قواطع مكتب شركة التقنية', subtitle: 'PARTITIONS · الدمام' },
              { cat: 'shower', span: '', img: 'https://www.glassartdesign.com/wp-content/uploads/2025/05/Glass-Shower-Enclosures.jpg', title: 'كبائن فيلا المحمدية الفاخرة', subtitle: 'SHOWER · جدة' },
              { cat: 'facades', span: '', img: 'https://glassenterprises.com/wp-content/uploads/2022/11/modern-buildings-with-glass-facade-1024x1024.jpg', title: 'واجهة المجمع التجاري الذهبي', subtitle: 'FACADES · مكة المكرمة' },
              { cat: 'mirrors', span: '', img: 'https://www.ibmirror.com/docs/240125_142731_ibmirror_mirror_led_light_min.webp', title: 'مرايا ليد — صالون راقٍ', subtitle: 'MIRRORS · الرياض' },
              { cat: 'partitions', span: '', img: 'https://www.viewrail.com/wp-content/uploads/2018/11/172A9943-scaled.jpg', title: 'درابزين زجاجي — فيلا النخيل', subtitle: 'RAILINGS · الرياض' }
            ].map((g, i) => (
              <div key={i} className={`gallery-item ${g.span}`} style={{ display: (activeFilter === 'all' || activeFilter === g.cat) ? 'block' : 'none' }}>
                <img loading="lazy" decoding="async" className="gallery-img" src={g.img} alt={g.title} />
                <div className="gallery-overlay">
                  <div className="gallery-title">{g.title}</div>
                  <div className="gallery-cat">{g.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="py-8 bg-[#0a0a0a]"><SectionCTA /></div>
      <GallerySlider />
      <section id="partners">
        <div className="partners-inner">
          <div className="partners-title">CLIENTS & PARTNERS · عملاؤنا وشركاؤنا</div>
          <div className="partners-grid">
            {[
              { icon: '🏢', name: 'أبعاد التطوير', sub: 'DEVELOPMENT', color: 'rgba(43,139,191,0.1)' },
              { icon: '🏛️', name: 'المجموعة المعمارية', sub: 'ARCHITECTURE', color: 'rgba(201,162,39,0.1)' },
              { icon: '🏗️', name: 'بناء الرياض', sub: 'CONSTRUCTION', color: 'rgba(34,197,94,0.1)' },
              { icon: '🏨', name: 'فنادق النخبة', sub: 'HOSPITALITY', color: 'rgba(124,58,237,0.1)' },
              { icon: '🏬', name: 'مجمعات التسوق', sub: 'RETAIL', color: 'rgba(236,72,153,0.1)' },
              { icon: '🏛️', name: 'رؤية المستقبل', sub: 'TECHNOLOGY', color: 'rgba(2,132,199,0.1)' }
            ].map((p, i) => (
              <div key={i} className="partner-logo">
                <div className="partner-logo-icon" style={{background: p.color}}>{p.icon}</div>
                <div>
                  <div className="partner-logo-name">{p.name}</div>
                  <div className="partner-logo-sub">{p.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="process">
        <div className="process-inner">
          <div className="section-header reveal">
            <div className="section-tag" style={{color:'var(--glass-300)'}}>HOW IT WORKS · كيف نعمل</div>
            <h2 className="section-h2">من الفكرة إلى التسليم</h2>
            <p className="section-desc">عملية واضحة وبسيطة لضمان تسليم مشروعك بأعلى جودة وفي الوقت المحدد</p>
          </div>

          <div className="process-steps">
            {[
              { title: 'التواصل الأولي', desc: 'اتصل أو أرسل رسالة وصف موجز لمشروعك', icon: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81"/> },
              { title: 'المعاينة المجانية', desc: 'يزورك فريقنا لقياس الموقع وتقديم الاستشارة', icon: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></> },
              { title: 'عرض السعر', desc: 'تسعيرة مفصّلة وشفافة بدون أرقام مخفية', icon: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></> },
              { title: 'التصنيع والتركيب', desc: 'قص وتجهيز الزجاج بأحدث الآلات ثم التركيب الاحترافي', icon: <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/> },
              { title: 'التسليم والضمان', desc: 'تنظيف الموقع وتسليم شهادة الضمان الشامل', icon: <><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></> }
            ].map((s, i) => (
              <div key={i} className={`step-item reveal reveal-delay-${i+1}`}>
                <div className="step-num">
                  <svg className="step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg>
                </div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="py-8 bg-gray-50"><SectionCTA /></div>

      <section id="testimonials">
        <div className="testimonials-inner">
          <div className="section-header reveal">
            <div className="section-tag">REVIEWS · آراء العملاء</div>
            <h2 className="section-h2">ماذا يقول عملاؤنا</h2>
            <p className="section-desc">أكثر من 200 عميل سعيد في الرياض — هذه بعض قصصهم</p>
          </div>

          <div className="testi-grid">
            <div className="testi-card featured reveal reveal-delay-1">
              <div className="testi-stars">
                {[1,2,3,4,5].map(k => <svg key={k} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
              </div>
              <p className="testi-text">تعاملنا معهم في تنفيذ واجهات مشروعنا التجاري الكبير. احترافية عالية، التزام دقيق بالمواعيد، وجودة تنفيذ تفوق ما رأيناه في شركات أخرى. فريق محترم ومتعاون من أول لحظة.</p>
              <div className="testi-divider"></div>
              <div className="testi-author">
                <div className="testi-avatar-initial">خ</div>
                <div>
                  <div className="testi-name" style={{color:'white'}}>م. خالد العتيبي</div>
                  <div className="testi-role">مدير المشاريع — مجموعة أبعاد التطوير</div>
                </div>
              </div>
            </div>

            <div className="testi-card reveal reveal-delay-2">
              <div className="testi-stars">
                {[1,2,3,4,5].map(k => <svg key={k} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
              </div>
              <p className="testi-text">كبائن الشاور اللي ركبوها لنا في الفيلا جميلة جداً والشغل نظيف ومرتب. الفريق محترم وما خلّف أي وسخة بعد التركيب. أنصح بالتعامل معهم بكل ثقة.</p>
              <div className="testi-divider"></div>
              <div className="testi-author">
                <div className="testi-avatar-initial">ف</div>
                <div>
                  <div className="testi-name">أبو فيصل الشهري</div>
                  <div className="testi-role">مالك فيلا — حي الملقا، الرياض</div>
                </div>
              </div>
            </div>

            <div className="testi-card reveal reveal-delay-3">
              <div className="testi-stars">
                {[1,2,3,4,5].map(k => <svg key={k} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
              </div>
              <p className="testi-text">القواطع الزجاجية حوّلت مكاتبنا. الآن بيئة العمل أجمل وأكثر إنتاجية. السرعة في التنفيذ كانت مذهلة — أنجزوا في يومين ما كنا نتوقعه في أسبوع.</p>
              <div className="testi-divider"></div>
              <div className="testi-author">
                <div className="testi-avatar-initial">ع</div>
                <div>
                  <div className="testi-name">عبدالله المطيري</div>
                  <div className="testi-role">المدير التنفيذي — شركة رؤية المستقبل</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="py-8 bg-white"><SectionCTA /></div>

      <section id="faq">
        <div className="faq-inner">
          <div className="section-header reveal">
            <div className="section-tag">FAQ · الأسئلة الشائعة</div>
            <h2 className="section-h2">إجابات لأسئلتك</h2>
          </div>

          <div className="faq-list reveal">
            {[
              { q: 'ما هو أفضل نوع زجاج للواجهات التجارية؟', a: 'للواجهات التجارية نوصي بالزجاج المزدوج (Double Glass) لعزله الحراري والصوتي الممتاز، مع زجاج سيكوريت بسماكة 10-12 ملم للأبواب. نقدم استشارة مجانية لتحديد الأنسب لمشروعك.' },
              { q: 'كم يستغرق تنفيذ مشروع كبائن شاور؟', a: 'كبائن الشاور الستاندرد تستغرق 1-2 يوم من أخذ المقاسات حتى التركيب النهائي. الكبائن المخصصة ذات الأبعاد الكبيرة قد تحتاج 3-5 أيام. نحدد الجدول الزمني الدقيق بعد المعاينة.' },
              { q: 'هل تقدمون خدمة المعاينة المجانية؟', a: 'نعم، نقدم معاينة ميدانية مجانية لجميع المشاريع داخل الرياض. فريقنا يزورك لأخذ المقاسات الدقيقة، تقديم الاستشارة، وتقديم عرض السعر التفصيلي — كل ذلك بدون أي رسوم.' },
              { q: 'ما هي مدة وشروط الضمان؟', a: 'نقدم ضماناً شاملاً يصل إلى 10 سنوات على جودة الزجاج المستخدم، وضماناً على التركيب والإكسسوارات. الضمان يشمل أي عيوب في المواد أو التركيب ولا يشمل الأضرار الناتجة عن سوء الاستخدام.' },
              { q: 'كيف أحافظ على نظافة ولمعان الزجاج؟', a: 'استخدم منظفات الزجاج المخصصة وقطعة قماش مايكروفايبر. تجنب المواد الكاشطة والشفرات الحادة. لكبائن الشاور، امسح الزجاج بعد كل استخدام لمنع التكلسات. نقدم لكل عميل دليل عناية مجاني عند التسليم.' }
            ].map((f, i) => (
              <div key={i} className={`faq-item ${i===0 ? 'open' : ''}`}>
                <button className="faq-trigger" onClick={toggleFaq}>
                  {f.q}
                  <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                <div className="faq-body">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="py-8 bg-gray-50"><SectionCTA /></div>
      <Blog />
      <div className="py-8 bg-white"><SectionCTA /></div>
      <section id="contact">
        <div className="contact-inner">
          <div>
            <div className="section-tag reveal">CONTACT · تواصل معنا</div>
            <h2 className="section-h2 reveal reveal-delay-1">جاهزون لتنفيذ مشروعك</h2>
            <p className="section-desc reveal reveal-delay-2">استشارة مجانية، تسعيرة فورية، ومعاينة ميدانية بدون أي التزام</p>

            <div className="contact-info-cards">
              <a href="tel:+966510233706" className="contact-info-card reveal reveal-delay-1">
                <div className="cic-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.12.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0122 14.92v2z"/></svg>
                </div>
                <div>
                  <div className="cic-label">اتصل مباشرة</div>
                  <div className="cic-value" dir="ltr">+966 51 023 3706</div>
                </div>
              </a>
              <a href="https://wa.me/966510233706" target="_blank" rel="noopener noreferrer" className="contact-info-card reveal reveal-delay-2">
                <div className="cic-icon" style={{background:'rgba(37,211,102,0.1)'}}>
                  <svg viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </div>
                <div>
                  <div className="cic-label">واتساب — رد فوري</div>
                  <div className="cic-value" dir="ltr">+966 51 023 3706</div>
                </div>
              </a>
              <div className="contact-info-card reveal reveal-delay-3">
                <div className="cic-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <div className="cic-label">موقعنا</div>
                  <div className="cic-value">طريق الملك فهد، حي العليا، الرياض</div>
                </div>
              </div>
              <div className="contact-map-wrap reveal reveal-delay-3">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3625.7!2d46.6753!3d24.7136!1m3!1d3625.7!2d46.6753!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQyJzQ5LjAiTiA0NsKwNDAnMzEuMSJF!5e0!3m2!1sar!2ssa!4v1700000000000" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="موقع زجاج الرياض"></iframe>
              </div>
              <div className="contact-info-card reveal reveal-delay-4">
                <div className="cic-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div>
                  <div className="cic-label">ساعات العمل</div>
                  <div className="cic-value">الأحد – الخميس: 8 ص – 6 م</div>
                </div>
              </div>
            </div>
          </div>

          <form ref={formRef} className="contact-form-card reveal reveal-delay-2" onSubmit={(e) => { e.preventDefault(); handleSubmit(e as unknown as React.MouseEvent); }}>
            <div className="form-title">أرسل لنا تفاصيل مشروعك</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">الاسم</label>
                <input type="text" className="form-input" placeholder="أحمد محمد"/>
              </div>
              <div className="form-group">
                <label className="form-label">رقم الجوال</label>
                <input type="tel" className="form-input" placeholder="+966 5X XXX XXXX" dir="ltr" style={{textAlign:'right'}}/>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">نوع الخدمة</label>
              <select className="form-select">
                <option value="">اختر الخدمة...</option>
                <option>واجهات زجاجية</option>
                <option>قواطع مكتبية</option>
                <option>كبائن شاور</option>
                <option>أبواب زجاجية</option>
                <option>مرايا ديكورية</option>
                <option>درابزين زجاجي</option>
                <option>أخرى</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">تفاصيل المشروع</label>
              <textarea className="form-textarea" placeholder="أخبرنا بتفاصيل مشروعك — الأبعاد التقريبية، نوع المبنى، أي متطلبات خاصة..."></textarea>
            </div>
            <button type="submit" className="form-submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20,animation:'spin 1s linear infinite'}}><path d="M21 12a9 9 0 01-9 9"/></svg>
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  إرسال الطلب
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      <Footer />

      <div className="fab-wrap">
        <a href="https://wa.me/966510233706" target="_blank" rel="noopener noreferrer" className="fab fab-wa" title="واتساب">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="white"/></svg>
        </a>
        <button className="fab fab-chat" title="محادثة سريعة" onClick={() => scrollTo('contact')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        </button>
      </div>

      <div className={`toast ${showToast ? 'show' : ''}`} style={toastMsg.isError ? {background:'#ef4444'} : {}}>
        <div className="toast-icon">
          <svg viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <span>{toastMsg.text}</span>
      </div>

      <button className={`back-top ${showBackTop ? 'show' : ''}`} aria-label="العودة للأعلى" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
        <svg viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
      </button>

      <div className={`calc-overlay ${isCalcOpen ? 'open' : ''}`} onClick={(e) => { if(e.target === e.currentTarget) setIsCalcOpen(false); }}>
        <div className="calc-modal">
          <div className="calc-modal-header">
            <div className="calc-close" onClick={() => setIsCalcOpen(false)}>
              <svg viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </div>
            <div className="calc-modal-title">حاسبة تكلفة الزجاج</div>
            <div className="calc-modal-sub">أدخل التفاصيل واحصل على تقدير فوري لميزانيتك</div>
          </div>
          <div className="calc-modal-body">
            <div className="calc-field">
              <label className="calc-field-label">المساحة (م²)</label>
              <input type="number" className="calc-field-input" placeholder="مثال: 25" min="1" value={calcArea} onChange={e => setCalcArea(e.target.value ? Number(e.target.value) : '')}/>
            </div>
            <div className="calc-field">
              <label className="calc-field-label">نوع الزجاج</label>
              <div className="calc-type-grid" id="calcTypeGrid">
                {[
                  { name: 'سيكوريت عادي', price: 350 },
                  { name: 'سيكوريت مزدوج', price: 550 },
                  { name: 'ملون ديكوري', price: 450 },
                  { name: 'ذكي/تشارك', price: 800 }
                ].map(t => (
                  <div key={t.name} className={`calc-type-option ${calcType === t.name ? 'selected' : ''}`} onClick={() => setCalcType(t.name)}>
                    <div className="calc-type-name">{t.name}</div>
                    <div className="calc-type-price">{t.price} ر.س / م²</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="calc-field">
              <label className="calc-field-label">إضافات</label>
              <div className="calc-extras">
                <div className={`calc-extra-item ${calcExtras.professional ? 'checked' : ''}`} onClick={() => setCalcExtras({...calcExtras, professional: !calcExtras.professional})}>
                  <div className="calc-extra-check">
                    <svg viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div className="calc-extra-label">تركيب احترافي</div>
                  <div className="calc-extra-price">+80 ر.س / م²</div>
                </div>
                <div className={`calc-extra-item ${calcExtras.luxury ? 'checked' : ''}`} onClick={() => setCalcExtras({...calcExtras, luxury: !calcExtras.luxury})}>
                  <div className="calc-extra-check">
                    <svg viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div className="calc-extra-label">إكسسوارات فاخرة</div>
                  <div className="calc-extra-price">+50 ر.س / م²</div>
                </div>
                <div className={`calc-extra-item ${calcExtras.delivery ? 'checked' : ''}`} onClick={() => setCalcExtras({...calcExtras, delivery: !calcExtras.delivery})}>
                  <div className="calc-extra-check">
                    <svg viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div className="calc-extra-label">توصيل وتركيب</div>
                  <div className="calc-extra-price">+30 ر.س / م²</div>
                </div>
              </div>
            </div>
            <div className="calc-result">
              <div className="calc-result-label">التكلفة التقديرية</div>
              <div className="calc-result-value">{calcResult.total.toLocaleString('ar-SA')} ر.س</div>
              <div className="calc-result-range">النطاق: {calcResult.low.toLocaleString('ar-SA')} — {calcResult.high.toLocaleString('ar-SA')} ر.س</div>
              <div className="calc-result-note">هذا تقدير مبدئي. السعر النهائي يعتمد على المعاينة الميدانية</div>
            </div>
            <button className="calc-cta-btn" onClick={() => { setIsCalcOpen(false); scrollTo('contact'); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.12.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0122 14.92v2z"/></svg>
              اطلب تسعيرة دقيقة الآن
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
