import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

import_bg = "import PremiumBackground from './components/PremiumBackground';\n"
content = content.replace("import Dashboard from './pages/Dashboard';\n" + import_bg, "import Dashboard from './pages/Dashboard';")
content = content.replace('<div className="min-h-screen bg-transparent font-sans text-right ltr:text-left">\n            <PremiumBackground />', '<div className="min-h-screen bg-white font-sans text-right ltr:text-left">')
with open('src/App.tsx', 'w') as f: f.write(content)

with open('src/components/Navbar.tsx', 'r') as f:
    content = f.read()
scroll_effect = """  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);"""
content = content.replace("export default function Navbar() {\n" + scroll_effect, "export default function Navbar() {")
content = content.replace('className={`fixed w-full z-50 transition-all duration-500 border-b ${isScrolled ? \'bg-white/80 backdrop-blur-xl shadow-lg border-gray-200/50 py-1\' : \'bg-transparent border-transparent py-4\'}`}', 'className="fixed w-full z-50 transition-all duration-300 shadow-md bg-white border-b border-gray-100"')
with open('src/components/Navbar.tsx', 'w') as f: f.write(content)

with open('src/components/Hero.tsx', 'r') as f:
    content = f.read()
content = content.replace('className="w-full h-full object-cover grayscale opacity-20 filter blur-sm transition-all duration-1000 scale-105 group-hover:scale-100"', 'className="w-full h-full object-cover grayscale opacity-30"')
content = content.replace('bg-gradient-to-t from-white via-white/80 to-transparent md:bg-gradient-to-l md:from-white/95 md:via-white/70 md:to-transparent ltr:md:bg-gradient-to-r', 'bg-gradient-to-l from-[#F9FAFB]/95 via-[#F9FAFB]/80 to-transparent md:from-[#F9FAFB] md:via-[#F9FAFB]/90 md:to-transparent ltr:bg-gradient-to-r')
content = content.replace('className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-600 leading-[1.1] mb-8 tracking-tight drop-shadow-sm"', 'className="text-4xl md:text-7xl font-extrabold text-[#0F172A] leading-[1.1] mb-6"')
content = content.replace('className="text-xl md:text-2xl text-slate-700/80 mb-10 leading-relaxed max-w-2xl font-medium"', 'className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl"')
content = content.replace('className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-8 py-4 font-bold text-lg rounded-2xl shadow-[0_8px_30px_rgb(16,185,129,0.3)] hover:shadow-[0_8px_30px_rgb(16,185,129,0.5)] transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 group"', 'className="bg-[#25D366] text-white px-8 py-4 font-bold text-lg hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 group"')
content = content.replace('className="bg-white/50 backdrop-blur-md text-slate-800 border-2 border-white/60 px-8 py-4 font-bold text-lg rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-white transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"', 'className="bg-transparent text-[#111827] border-2 border-[#111827] px-8 py-4 font-bold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center"')
with open('src/components/Hero.tsx', 'w') as f: f.write(content)

with open('src/components/Services.tsx', 'r') as f:
    content = f.read()
new_card = """                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-4 border border-white/20 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-md">{service.title}</h3>
                  <p className="text-slate-200 line-clamp-2 mb-6 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                    {service.description}
                  </p>
                  <Link 
                    to={`/services/${slug}`}
                    className="inline-flex items-center gap-2 bg-white/20 hover:bg-white text-white hover:text-slate-900 px-6 py-3 rounded-xl font-bold transition-all duration-300 opacity-0 group-hover:opacity-100 delay-200 backdrop-blur-md w-fit"
                  >
                    عرض التفاصيل
                    <svg className="w-5 h-5 ltr:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </Link>
                </div>"""
old_card = """                <div className="bg-gray-50 p-6 flex-1 flex flex-col items-start text-right ltr:text-left">
                  <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center text-[#0284C7] shadow-sm mb-4 border border-gray-100">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed flex-1">
                    {service.description}
                  </p>
                  <Link 
                    to={`/services/${slug}`}
                    className="text-[#0284C7] font-bold hover:text-[#0369A1] transition-colors flex items-center gap-2 mt-auto"
                  >
                    عرض التفاصيل
                    <svg className="w-5 h-5 ltr:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </Link>
                </div>"""
content = content.replace(new_card, old_card)
content = content.replace('className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-[450px] group"', 'className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group"')
content = content.replace('className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"', 'className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"')
with open('src/components/Services.tsx', 'w') as f: f.write(content)
