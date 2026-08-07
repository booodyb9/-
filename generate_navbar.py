import re

jsx_code = """
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setIsMobileNavOpen(false);
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <nav id="nav" className={isScrolled ? 'scrolled' : ''}>
        <div className="nav-inner">
          <Link to="/" className="nav-logo" onClick={() => window.scrollTo(0,0)}>
            <div className="nav-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/>
                <line x1="12" y1="22" x2="12" y2="15.5"/>
                <polyline points="22 8.5 12 15.5 2 8.5"/>
              </svg>
            </div>
            <div>
              <div className="nav-logo-ar">زجاج الرياض</div>
              <div className="nav-logo-en">RIYADH GLASS</div>
            </div>
          </Link>

          <ul className="nav-links">
            <li><Link to="/services">خدماتنا</Link></li>
            <li><Link to="/portfolio">أعمالنا</Link></li>
            <li><a href="#why" onClick={(e) => { e.preventDefault(); scrollTo('why'); }}>لماذا نحن</a></li>
            <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollTo('testimonials'); }}>آراء العملاء</a></li>
            <li><Link to="/faq">الأسئلة الشائعة</Link></li>
            <li><Link to="/contact" className="btn nav-cta">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              تواصل معنا
            </Link></li>
          </ul>

          <button className={`hamburger ${isMobileNavOpen ? 'open' : ''}`} aria-label="القائمة" onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}>
            <span></span><span></span><span></span>
          </button>
        </div>

        <div className={`mobile-nav ${isMobileNavOpen ? 'open' : ''}`}>
          <Link to="/services" onClick={() => setIsMobileNavOpen(false)}>خدماتنا</Link>
          <Link to="/portfolio" onClick={() => setIsMobileNavOpen(false)}>معرض الأعمال</Link>
          <a href="#why" onClick={(e) => { e.preventDefault(); scrollTo('why'); }}>لماذا نحن</a>
          <a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollTo('testimonials'); }}>آراء العملاء</a>
          <Link to="/faq" onClick={() => setIsMobileNavOpen(false)}>الأسئلة الشائعة</Link>
          <Link to="/contact" className="nav-cta-mobile" onClick={() => setIsMobileNavOpen(false)}>اطلب تسعيرة مجانية</Link>
        </div>
      </nav>
    </>
  );
}
"""

with open('src/components/Navbar.tsx', 'w') as f:
    f.write(jsx_code)

print("Navbar.tsx updated")
