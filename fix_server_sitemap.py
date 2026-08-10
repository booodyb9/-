import re

with open('server.js', 'r') as f:
    content = f.read()

old_portfolio = """          if (item.key === 'premium_portfolio_projects') {
            const projects = JSON.parse(item.body);
            projects.forEach(p => {
              if (p.seoNoIndex) return;
              const slug = p.title.replace(/\s+/g, '-').toLowerCase();
              urls.push(`<url><loc>${baseUrl}/portfolio/${encodeURIComponent(slug)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
            });
          }"""

new_portfolio = """          if (item.key === 'premium_portfolio_projects') {
            const projects = JSON.parse(item.body);
            projects.forEach(p => {
              if (p.seoNoIndex) return;
              const slug = p.slug || p.id;
              if (slug) {
                urls.push(`<url><loc>${baseUrl}/portfolio/${encodeURIComponent(slug)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
              }
            });
          }"""

if old_portfolio in content:
    content = content.replace(old_portfolio, new_portfolio)
    with open('server.js', 'w') as f:
        f.write(content)
    print("Fixed server.js sitemap logic for portfolio")
else:
    print("Could not find portfolio logic in server.js")
