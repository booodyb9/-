import re

with open('src/pages/public/Home.tsx', 'r') as f:
    content = f.read()

old_map = """        {orderedSections.map((section: any) => {
          if (!section.isVisible) return null;
          
          switch (section.id) {
            case 'hero': return <Hero key="hero" />;
            
            case 'services': return <Services key="services" />;
            case 'portfolio': return <div key="portfolio"><Gallery limit={6} featuredOnly /></div>;
            case 'features': return <Features key="features" />;
            case 'visualizer': return <GlassVisualizer key="visualizer" />;
            case 'stats': return <ProjectStats key="stats" />;
            case 'partners': return <TrustedPartners key="partners" />;
            // Future compatibility with other sections
            default: return null;
          }
        })}"""

new_map = """        {orderedSections.map((section: any, index: number) => {
          if (!section.isVisible) return null;
          
          const key = `${section.id}-${index}`;
          switch (section.id) {
            case 'hero': return <Hero key={key} />;
            case 'services': return <Services key={key} />;
            case 'portfolio': return <div key={key}><Gallery limit={6} featuredOnly /></div>;
            case 'features': return <Features key={key} />;
            case 'visualizer': return <GlassVisualizer key={key} />;
            case 'stats': return <ProjectStats key={key} />;
            case 'partners': return <TrustedPartners key={key} />;
            default: return null;
          }
        })}"""

if old_map in content:
    content = content.replace(old_map, new_map)
else:
    # use regex
    content = re.sub(
        r'\{orderedSections\.map\(\(section: any\) => \{.*?\n\s+if \(\!section\.isVisible\) return null;\s+switch \(section\.id\) \{.*?default: return null;\s+\}\s+\}\)\}',
        new_map,
        content,
        flags=re.DOTALL
    )

with open('src/pages/public/Home.tsx', 'w') as f:
    f.write(content)
