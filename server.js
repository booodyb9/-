import { GoogleGenAI } from '@google/genai';
import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT) || 3000;

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in the server environment.');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const DEFAULT_SITE_URL = (process.env.SITE_URL || 'https://riyadh-glass.ai.studio').replace(/\/$/, '');

app.disable('x-powered-by');
app.use(compression());
app.use(express.json({ limit: '256kb' }));

function escapeXml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

async function getSiteUrl() {
  try {
    const { data } = await supabase
      .from('site_settings')
      .select('site_domain')
      .eq('id', 1)
      .maybeSingle();
    const configured = data?.site_domain?.trim();
    if (configured && /^https?:\/\//i.test(configured)) {
      return configured.replace(/\/$/, '');
    }
  } catch (error) {
    console.error('Unable to load site domain:', error);
  }
  return DEFAULT_SITE_URL;
}

async function requireAdmin(req, res, next) {
  const authHeader = req.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const userClient = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser(token);
    if (userError || !userData.user) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    const { data: admin, error: adminError } = await userClient
      .from('admins')
      .select('user_id')
      .eq('user_id', userData.user.id)
      .maybeSingle();

    if (adminError || !admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.adminUser = userData.user;
    next();
  } catch (error) {
    console.error('Admin authorization failed:', error);
    return res.status(500).json({ error: 'Authorization failed' });
  }
}

app.post('/api/generate-seo', requireAdmin, async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'SEO generator is not configured' });
    }

    const title = typeof req.body?.title === 'string' ? req.body.title.trim().slice(0, 300) : '';
    const content = typeof req.body?.content === 'string' ? req.body.content.trim().slice(0, 12000) : '';
    const type = typeof req.body?.type === 'string' ? req.body.type.trim().slice(0, 60) : 'page';

    if (!title && !content) {
      return res.status(400).json({ error: 'Title or content is required' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are an expert SEO copywriter. Based on the following content for a ${type} page, suggest an SEO-optimized meta title (max 60 characters) and meta description (max 160 characters). Respond ONLY with a valid JSON object in this format: {"title":"Suggested Meta Title","description":"Suggested Meta Description"}.\n\nContent Title: ${title}\nContent Body: ${content}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const text = response.text?.() || '{}';
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (typeof parsed?.title !== 'string' || typeof parsed?.description !== 'string') {
      throw new Error('Unexpected SEO response shape');
    }

    res.json({
      title: parsed.title.slice(0, 70),
      description: parsed.description.slice(0, 180),
    });
  } catch (error) {
    console.error('Error generating SEO:', error);
    res.status(500).json({ error: 'Failed to generate SEO suggestions' });
  }
});

app.get('/robots.txt', async (_req, res) => {
  const siteUrl = await getSiteUrl();
  res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /dashboard\n\nSitemap: ${siteUrl}/sitemap.xml`);
});

app.get('/sitemap.xml', async (_req, res) => {
  try {
    const siteUrl = await getSiteUrl();
    const { data, error } = await supabase.from('contents').select('key,type,body');
    if (error) throw error;

    const urls = new Set([
      '/',
      '/about',
      '/services',
      '/portfolio',
      '/blog',
      '/faq',
      '/testimonials',
      '/contact',
      '/request-quote',
      '/sitemap',
    ]);

    for (const item of data ?? []) {
      if (!item.body) continue;
      try {
        if (item.key === 'services_items') {
          for (const service of JSON.parse(item.body)) {
            if (service?.seoNoIndex || service?.isHidden || !service?.title) continue;
            const slug = service.slug || service.title.replace(/\s+/g, '-').toLowerCase();
            urls.add(`/services/${encodeURIComponent(slug)}`);
          }
        } else if (item.key === 'blog_items') {
          for (const post of JSON.parse(item.body)) {
            if (post?.seoNoIndex || post?.isHidden || !post?.title) continue;
            const slug = post.slug || post.title.replace(/\s+/g, '-').toLowerCase();
            urls.add(`/blog/${encodeURIComponent(slug)}`);
          }
        } else if (item.key === 'premium_portfolio_projects') {
          for (const project of JSON.parse(item.body)) {
            if (project?.seoNoIndex || project?.isHidden || !project?.title) continue;
            const slug = project.slug || project.title.replace(/\s+/g, '-').toLowerCase();
            urls.add(`/portfolio/${encodeURIComponent(slug)}`);
          }
        } else if (item.key.startsWith('page_') && item.type === 'page') {
          const pageData = JSON.parse(item.body);
          if (pageData?.status === 'published' && pageData?.slug && !pageData?.seo?.noindex) {
            urls.add(`/${encodeURIComponent(pageData.slug)}`);
          }
        }
      } catch (error) {
        console.warn(`Skipping invalid sitemap content for ${item.key}:`, error);
      }
    }

    const sitemapEntries = [...urls]
      .map((pathname) => `<url><loc>${escapeXml(`${siteUrl}${pathname}`)}</loc></url>`)
      .join('\n  ');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${sitemapEntries}\n</urlset>`;
    res.type('application/xml').send(sitemap);
  } catch (error) {
    console.error('Sitemap generation failed:', error);
    res.status(500).type('text/plain').send('Unable to generate sitemap');
  }
});

app.use(
  express.static(path.join(__dirname, 'dist'), {
    maxAge: '1y',
    immutable: true,
    setHeaders(res, filePath) {
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  }),
);

app.use((_req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
