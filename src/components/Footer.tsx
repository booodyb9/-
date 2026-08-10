
import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-brand-name">
            <img src="/logo.png" alt="Riyadh Glass" className="h-10 w-auto object-contain drop-shadow-sm brightness-0 invert" onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://wfmmedia.com/wp-content/uploads/2024/11/Modern-Glass-Facade-Architecture.webp'; // Fallback
            }} />
          </div>
          <p className="footer-brand-desc">شركتك الموثوقة لجميع أعمال وتوريدات الزجاج في مدينة الرياض. جودة عالمية، أسعار تنافسية، وخدمة احترافية منذ 2009.</p>
        </div>
        <div>
          <div className="footer-col-title">خدماتنا</div>
          <ul className="footer-links">
            <li><Link to="/services/الواجهات-الزجاجية">الواجهات الزجاجية</Link></li>
            <li><Link to="/services/القواطع-الزجاجية">القواطع المكتبية</Link></li>
            <li><Link to="/services/كبائن-شاور">كبائن الشاور</Link></li>
            <li><Link to="/services/أبواب-زجاجية">الأبواب الزجاجية</Link></li>
            <li><Link to="/services/مرايا-ذكية">المرايا الديكورية</Link></li>
            <li><Link to="/services/درابزين-زجاج">الدرابزين الزجاجي</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">الشركة</div>
          <ul className="footer-links">
            <li><Link to="/about">من نحن</Link></li>
            <li><Link to="/portfolio">معرض الأعمال</Link></li>
            <li><Link to="/testimonials">آراء العملاء</Link></li>
            <li><Link to="/blog">المدونة</Link></li>
            <li><Link to="/faq">الأسئلة الشائعة</Link></li>
            <li><Link to="/contact">تواصل معنا</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">تواصل</div>
          <ul className="footer-links">
            <li><a href="tel:+966510233706" dir="ltr">+966 51 023 3706</a></li>
            <li><a href="mailto:info@riyadhglass.sa">info@riyadhglass.sa</a></li>
            <li><a href="#">طريق الملك فهد، العليا</a></li>
            <li><a href="#">الرياض، المملكة العربية السعودية</a></li>
            <li style={{marginTop:16}}><Link to="/privacy-policy">سياسة الخصوصية</Link></li>
            <li><Link to="/terms">الشروط والأحكام</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 شركة زجاج الرياض. جميع الحقوق محفوظة.</span>
        <span style={{display:'flex',alignItems:'center',gap:16}}>
          <Link to="/privacy-policy">سياسة الخصوصية</Link>
          <Link to="/terms">الشروط والأحكام</Link>
          <span style={{color:'rgba(255,255,255,0.25)'}}>•</span>
          <span style={{fontFamily:'var(--font-en)',letterSpacing:1,fontSize:12,color:'rgba(255,255,255,0.3)'}}>RIYADH · KSA</span>
        </span>
      </div>
    </footer>
  );
}
