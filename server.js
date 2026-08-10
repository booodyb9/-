import { GoogleGenAI } from '@google/genai';
import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the React app

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
const siteUrl = (process.env.SITE_URL || `http://localhost:${PORT}`).replace(/\/$/, '');


app.use(compression());
app.use(express.json());

app.post('/api/generate-seo', async (req, res) => {
  try {
    const { title, content, type } = req.body;
    if (!title && !content) {
      return res.status(400).json({ error: 'Title or content is required' });
    }
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'SEO generation is not configured' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are an expert SEO copywriter. Based on the following content for a ${type} page, suggest an SEO-optimized meta title (max 60 characters) and meta description (max 160 characters). Respond ONLY with a valid JSON object in this format: {"title": "Suggested Meta Title", "description": "Suggested Meta Description"}. Do not include markdown code block formatting or any other text.
    
    Content Title: ${title || ''}
    Content Body: ${content || ''}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error('Gemini returned an empty response');
    let jsonResult;
    try {
        jsonResult = JSON.parse(text);
    } catch (e) {
        // Fallback cleanup if model returned markdown
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        jsonResult = JSON.parse(cleaned);
    }

    res.json(jsonResult);
  } catch (error) {
    console.error('Error generating SEO:', error);
    res.status(500).json({ error: 'Failed to generate SEO suggestions' });
  }
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml`);
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const { data } = supabase
      ? await supabase.from('contents').select('*')
      : { data: null };
    
    let urls = [];
    const baseUrl = siteUrl;
    
    urls.push(`<url><loc>${baseUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`);
    urls.push(`<url><loc>${baseUrl}/about</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
    urls.push(`<url><loc>${baseUrl}/services</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`);
    urls.push(`<url><loc>${baseUrl}/portfolio</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`);
    urls.push(`<url><loc>${baseUrl}/blog</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
    urls.push(`<url><loc>${baseUrl}/faq</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`);
    urls.push(`<url><loc>${baseUrl}/testimonials</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`);
    urls.push(`<url><loc>${baseUrl}/contact</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`);
    urls.push(`<url><loc>${baseUrl}/request-quote</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`);
    urls.push(`<url><loc>${baseUrl}/sitemap</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`);
    
    if (data) {
      for (const item of data) {
        if (!item.body) continue;
        try {
          if (item.key === 'services_items') {
            const services = JSON.parse(item.body);
            services.forEach(s => {
              if (s.seoNoIndex) return;
              const slug = s.title.replace(/\s+/g, '-').toLowerCase();
              urls.push(`<url><loc>${baseUrl}/services/${encodeURIComponent(slug)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
            });
          }
          if (item.key === 'blog_items') {
            const posts = JSON.parse(item.body);
            posts.forEach(p => {
              if (p.seoNoIndex) return;
              const slug = p.title.replace(/\s+/g, '-').toLowerCase();
              urls.push(`<url><loc>${baseUrl}/blog/${encodeURIComponent(slug)}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`);
            });
          }
          if (item.key === 'premium_portfolio_projects') {
            const projects = JSON.parse(item.body);
            projects.forEach(p => {
              if (p.seoNoIndex) return;
              const slug = p.slug || p.id;
              if (slug) {
                urls.push(`<url><loc>${baseUrl}/portfolio/${encodeURIComponent(slug)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
              }
            });
          }
          if (item.key.startsWith('page_') && item.type === 'page') {
            const pageData = JSON.parse(item.body);
            if (pageData.status === 'published' && pageData.slug && !pageData.seo?.noindex) {
              urls.push(`<url><loc>${baseUrl}/${encodeURIComponent(pageData.slug)}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`);
            }
          }
        } catch (e) {
          // ignore parse errors
        }
      }
    }
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('\n  ')}
</urlset>`;
    
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (e) {
    res.status(500).end();
  }
});

app.use(express.static(path.join(__dirname, 'dist'), { maxAge: '1y' }));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
