
import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-brand-name">
            <div className="nav-logo-icon" style={{width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,var(--glass-500),var(--glass-700))',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></svg>
            </div>
            زجاج الرياض
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
            <li><Link to="/dashboard" className="text-gray-500 hover:text-white">لوحة التحكم</Link></li>
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
