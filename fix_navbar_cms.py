import re

with open('src/components/Navbar.tsx', 'w') as f:
    f.write("""import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';

export default function Navbar() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { getContent } = useContent();

  const navContent = getContent('navigation_links');
  
  const navLinks = useMemo(() => {
    if (navContent && navContent.body) {
      try {
        const parsed = JSON.parse(navContent.body);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((item: any) => ({ name: item.label, href: item.href }));
        }
      } catch (e) {}
    }
    return [
      { name: 'خدماتنا', href: '/services' },
      { name: 'أعمالنا', href: '/portfolio' },
      { name: 'الأسئلة الشائعة', href: '/faq' },
    ];
  }, [navContent]);

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
            {navLinks.map((link, idx) => (
              <li key={idx}>
                {link.href.startsWith('#') ? (
                  <a href={link.href} onClick={(e) => { e.preventDefault(); scrollTo(link.href.substring(1)); }}>{link.name}</a>
                ) : (
                  <Link to={link.href}>{link.name}</Link>
                )}
              </li>
            ))}
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
          {navLinks.map((link, idx) => (
             link.href.startsWith('#') ? (
               <a key={idx} href={link.href} onClick={(e) => { e.preventDefault(); scrollTo(link.href.substring(1)); }}>{link.name}</a>
             ) : (
               <Link key={idx} to={link.href} onClick={() => setIsMobileNavOpen(false)}>{link.name}</Link>
             )
          ))}
          <Link to="/contact" className="nav-cta-mobile" onClick={() => setIsMobileNavOpen(false)}>اطلب تسعيرة مجانية</Link>
        </div>
      </nav>
    </>
  );
}
""")
