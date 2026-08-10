import re

with open('src/components/Footer.tsx', 'r') as f:
    content = f.read()

old_logo = """          <div className="footer-brand-name">
            <div className="nav-logo-icon" style={{width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,var(--glass-500),var(--glass-700))',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></svg>
            </div>
            زجاج الرياض
          </div>"""

new_logo = """          <div className="footer-brand-name">
            <img src="/logo.png" alt="Riyadh Glass" className="h-10 w-auto object-contain drop-shadow-sm brightness-0 invert" onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://wfmmedia.com/wp-content/uploads/2024/11/Modern-Glass-Facade-Architecture.webp'; // Fallback
            }} />
          </div>"""

if old_logo in content:
    content = content.replace(old_logo, new_logo)
    with open('src/components/Footer.tsx', 'w') as f:
        f.write(content)
    print("Updated Footer.tsx successfully")
else:
    print("Could not find old logo in Footer.tsx")
