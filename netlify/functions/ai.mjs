import { createServerClients, generateAssistantReply, analyzeLocationImage, generateAdminContent, requireAdmin } from '../../server/ai-core.js';

const buckets = new Map();
function allowed(ip, max) {
  const now = Date.now();
  const current = buckets.get(ip);
  if (!current || current.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (current.count >= max) return false;
  current.count += 1;
  return true;
}

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  body: JSON.stringify(body)
});

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  const route = event.path.split('/').pop();
  const ip = event.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  const max = route === 'image' ? 5 : 15;
  if (!allowed(ip, max)) return json(429, { error: 'تم تجاوز حد الطلبات مؤقتاً. حاول بعد قليل.' });

  try {
    const body = JSON.parse(event.body || '{}');
    const { supabase, ai } = createServerClients();

    if (route === 'chat') {
      const reply = await generateAssistantReply({ ai, supabase, messages: body.messages });
      return json(200, { reply });
    }
    if (route === 'image') {
      const analysis = await analyzeLocationImage({ ai, image: body.image, note: body.note });
      return json(200, { analysis });
    }
    if (route === 'admin') {
      const req = { headers: { authorization: event.headers.authorization || '' } };
      const admin = await requireAdmin(req, supabase);
      if (!admin) return json(403, { error: 'غير مصرح.' });
      const result = await generateAdminContent({ ai, ...body });
      return json(200, { result });
    }
    if (route === 'generate-seo') {
      const req = { headers: { authorization: event.headers.authorization || '' } };
      const admin = await requireAdmin(req, supabase);
      if (!admin) return json(403, { error: 'غير مصرح.' });
      const raw = await generateAdminContent({ ai, task: 'seo', title: body.title, content: body.content });
      let parsed;
      try { parsed = JSON.parse(raw); } catch { parsed = { metaDescription: raw }; }
      return json(200, {
        title: parsed.metaTitle || parsed.title || '',
        description: parsed.metaDescription || parsed.description || '',
        keywords: parsed.keywords || ''
      });
    }
    return json(404, { error: 'Not found' });
  } catch (error) {
    console.error('Netlify AI function failed:', error instanceof Error ? error.message : 'Unknown error');
    const message = error instanceof Error ? error.message : '';
    if (/required|unsupported|too large|invalid/i.test(message)) return json(400, { error: message });
    if (/Missing GEMINI_API_KEY/i.test(message)) return json(503, { error: 'خدمة الذكاء الاصطناعي غير مهيأة بعد.' });
    return json(500, { error: 'تعذر إكمال الطلب حالياً.' });
  }
};
