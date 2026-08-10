content = open('server.js').read()

services_old = """
          if (item.key === 'services_items') {
            const services = JSON.parse(item.body);
            services.forEach(s => {
              const slug = s.title.replace(/\\s+/g, '-').toLowerCase();
              urls.push(`<url><loc>${baseUrl}/services/${encodeURIComponent(slug)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
            });
          }
"""

services_new = """
          if (item.key === 'services_items') {
            const services = JSON.parse(item.body);
            services.forEach(s => {
              if (s.seoNoIndex) return;
              const slug = s.title.replace(/\\s+/g, '-').toLowerCase();
              urls.push(`<url><loc>${baseUrl}/services/${encodeURIComponent(slug)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
            });
          }
"""

blog_old = """
          if (item.key === 'blog_items') {
            const posts = JSON.parse(item.body);
            posts.forEach(p => {
              const slug = p.title.replace(/\\s+/g, '-').toLowerCase();
              urls.push(`<url><loc>${baseUrl}/blog/${encodeURIComponent(slug)}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`);
            });
          }
"""

blog_new = """
          if (item.key === 'blog_items') {
            const posts = JSON.parse(item.body);
            posts.forEach(p => {
              if (p.seoNoIndex) return;
              const slug = p.title.replace(/\\s+/g, '-').toLowerCase();
              urls.push(`<url><loc>${baseUrl}/blog/${encodeURIComponent(slug)}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`);
            });
          }
"""

portfolio_old = """
          if (item.key === 'premium_portfolio_projects') {
            const projects = JSON.parse(item.body);
            projects.forEach(p => {
              const slug = p.title.replace(/\\s+/g, '-').toLowerCase();
              urls.push(`<url><loc>${baseUrl}/portfolio/${encodeURIComponent(slug)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
            });
          }
"""

portfolio_new = """
          if (item.key === 'premium_portfolio_projects') {
            const projects = JSON.parse(item.body);
            projects.forEach(p => {
              if (p.seoNoIndex) return;
              const slug = p.title.replace(/\\s+/g, '-').toLowerCase();
              urls.push(`<url><loc>${baseUrl}/portfolio/${encodeURIComponent(slug)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
            });
          }
"""

pages_old = """
          if (item.key.startsWith('page_') && item.type === 'page') {
            const pageData = JSON.parse(item.body);
            if (pageData.status === 'published' && pageData.slug) {
              urls.push(`<url><loc>${baseUrl}/${encodeURIComponent(pageData.slug)}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`);
            }
          }
"""

pages_new = """
          if (item.key.startsWith('page_') && item.type === 'page') {
            const pageData = JSON.parse(item.body);
            if (pageData.status === 'published' && pageData.slug && !pageData.seo?.noindex) {
              urls.push(`<url><loc>${baseUrl}/${encodeURIComponent(pageData.slug)}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`);
            }
          }
"""

content = content.replace(services_old.strip(), services_new.strip())
content = content.replace(blog_old.strip(), blog_new.strip())
content = content.replace(portfolio_old.strip(), portfolio_new.strip())
content = content.replace(pages_old.strip(), pages_new.strip())

open('server.js', 'w').write(content)
