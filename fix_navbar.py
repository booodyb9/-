import re

with open('src/components/Navbar.tsx', 'r') as f:
    content = f.read()

old_logo = """          <Link to="/" className="nav-logo" onClick={() => window.scrollTo(0,0)}>
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
          </Link>"""

new_logo = """          <Link to="/" className="nav-logo" onClick={() => window.scrollTo(0,0)}>
            <img src="/logo.png" alt="Riyadh Glass" className="h-12 w-auto object-contain drop-shadow-md" onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://wfmmedia.com/wp-content/uploads/2024/11/Modern-Glass-Facade-Architecture.webp'; // Fallback
            }} />
          </Link>"""

if old_logo in content:
    content = content.replace(old_logo, new_logo)
    with open('src/components/Navbar.tsx', 'w') as f:
        f.write(content)
    print("Updated Navbar.tsx successfully")
else:
    print("Could not find old logo in Navbar.tsx")
