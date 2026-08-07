content = open('server.js').read()

import re

new_services = """
          if (item.key === 'services_items') {
            const services = JSON.parse(item.body);
            services.forEach(s => {
              if (s.seoNoIndex) return;
              const slug = s.title.replace(/\s+/g, '-').toLowerCase();
              urls.push(`<url><loc>${baseUrl}/services/${encodeURIComponent(slug)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
            });
          }
"""

new_blog = """
          if (item.key === 'blog_items') {
            const posts = JSON.parse(item.body);
            posts.forEach(p => {
              if (p.seoNoIndex) return;
              const slug = p.title.replace(/\s+/g, '-').toLowerCase();
              urls.push(`<url><loc>${baseUrl}/blog/${encodeURIComponent(slug)}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`);
            });
          }
"""

new_portfolio = """
          if (item.key === 'premium_portfolio_projects') {
            const projects = JSON.parse(item.body);
            projects.forEach(p => {
              if (p.seoNoIndex) return;
              const slug = p.title.replace(/\s+/g, '-').toLowerCase();
              urls.push(`<url><loc>${baseUrl}/portfolio/${encodeURIComponent(slug)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
            });
          }
"""

new_pages = """
          if (item.key.startsWith('page_') && item.type === 'page') {
            const pageData = JSON.parse(item.body);
            if (pageData.status === 'published' && pageData.slug && !pageData.seo?.noindex) {
              urls.push(`<url><loc>${baseUrl}/${encodeURIComponent(pageData.slug)}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`);
            }
          }
"""

content = re.sub(r"if \(item\.key === 'services_items'\) \{.*?\}(?=\s*if)", new_services, content, flags=re.DOTALL)
content = re.sub(r"if \(item\.key === 'blog_items'\) \{.*?\}(?=\s*if)", new_blog, content, flags=re.DOTALL)
content = re.sub(r"if \(item\.key === 'premium_portfolio_projects'\) \{.*?\}(?=\s*if)", new_portfolio, content, flags=re.DOTALL)
content = re.sub(r"if \(item\.key\.startsWith\('page_'\) && item\.type === 'page'\) \{.*?\}(?=\s*\})", new_pages, content, flags=re.DOTALL)

open('server.js', 'w').write(content)
