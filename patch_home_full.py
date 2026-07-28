import re

with open('src/pages/public/Home.tsx', 'r') as f:
    content = f.read()

import_blog = "import Blog from '../../components/Blog';\n"
import_testimonials = "import Testimonials from '../../components/Testimonials';\n"
import_faq = "import FAQ from '../../components/FAQ';\n"
import_contact = "import Contact from '../../components/Contact';\n"
import_process = "import Process from '../../components/Process';\n"

if 'import Blog' not in content:
    content = content.replace("import SplashAnimation", import_blog + import_testimonials + import_faq + import_contact + import_process + "import SplashAnimation")

old_switch = """          switch (section.id) {
            case 'hero': return <Hero key={key} />;
            case 'services': return <Services key={key} />;
            case 'portfolio': return <div key={key}><Gallery limit={6} featuredOnly /></div>;
            case 'features': return <Features key={key} />;
            case 'visualizer': return <GlassVisualizer key={key} />;
            case 'stats': return <ProjectStats key={key} />;
            case 'partners': return <TrustedPartners key={key} />;
            default: return null;
          }"""

new_switch = """          switch (section.id) {
            case 'hero': return <Hero key={key} />;
            case 'services': return <Services key={key} />;
            case 'portfolio': return <div key={key}><Gallery limit={6} featuredOnly /></div>;
            case 'features': return <Features key={key} />;
            case 'visualizer': return <GlassVisualizer key={key} />;
            case 'stats': return <ProjectStats key={key} />;
            case 'partners': return <TrustedPartners key={key} />;
            case 'blog': return <Blog key={key} />;
            case 'testimonials': return <Testimonials key={key} />;
            case 'faq': return <FAQ key={key} />;
            case 'contact': return <Contact key={key} />;
            case 'process': return <Process key={key} />;
            default: return null;
          }"""

content = content.replace(old_switch, new_switch)

with open('src/pages/public/Home.tsx', 'w') as f:
    f.write(content)
