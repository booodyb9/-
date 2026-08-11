import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function getServerConfig() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!supabaseUrl || !supabaseAnonKey) throw new Error('Missing Supabase server environment variables');
  if (!geminiApiKey) throw new Error('Missing GEMINI_API_KEY');
  return { supabaseUrl, supabaseAnonKey, geminiApiKey };
}

export function createServerClients() {
  const { supabaseUrl, supabaseAnonKey, geminiApiKey } = getServerConfig();
  return {
    supabase: createClient(supabaseUrl, supabaseAnonKey),
    ai: new GoogleGenAI({ apiKey: geminiApiKey })
  };
}

export async function buildBusinessContext(supabase) {
  const { data, error } = await supabase
    .from('contents')
    .select('key,title,body,type')
    .in('key', ['site_settings', 'company_info', 'services_items', 'faq_items']);
  if (error) throw error;

  const selected = (data || []).map((row) => ({ key: row.key, title: row.title, body: row.body }));
  return JSON.stringify(selected).slice(0, 24000);
}

export async function requireAdmin(req, supabase) {
  const auth = req.headers.authorization || req.headers.Authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return null;

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData?.user) return null;

  const { data: admin, error: adminError } = await supabase
    .from('admins')
    .select('user_id,email')
    .eq('user_id', userData.user.id)
    .maybeSingle();
  if (adminError || !admin) return null;
  return { user: userData.user, admin };
}

export function validateImagePayload(image) {
  if (!image || typeof image !== 'object') throw new Error('Image is required');
  const mimeType = String(image.mimeType || '');
  const data = String(image.data || '').replace(/^data:[^;]+;base64,/, '');
  if (!ALLOWED_IMAGE_TYPES.has(mimeType)) throw new Error('Unsupported image type');
  const approxBytes = Math.ceil((data.length * 3) / 4);
  if (!data || approxBytes > MAX_IMAGE_BYTES) throw new Error('Image is empty or too large');
  return { mimeType, data };
}

export async function generateAssistantReply({ ai, supabase, messages }) {
  const safeMessages = Array.isArray(messages) ? messages.slice(-12) : [];
  const businessContext = await buildBusinessContext(supabase);
  const conversation = safeMessages.map((m) => `${m.role === 'assistant' ? 'المساعد' : 'العميل'}: ${String(m.content || '').slice(0, 2000)}`).join('\n');

  const prompt = `أنت مساعد مبيعات وخدمة عملاء لشركة زجاج الرياض. أجب بالعربية باختصار ووضوح. استخدم فقط معلومات الشركة والخدمات الموجودة في السياق أدناه. لا تخترع أسعاراً أو مواعيد أو خدمات غير موجودة. إذا احتاج العميل سعراً نهائياً، اطلب المقاسات والمعاينة أو وجّهه لطلب عرض سعر/واتساب. لا تدّع تنفيذ حجز أو طلب لم يتم فعلياً.\n\nسياق الشركة:\n${businessContext}\n\nالمحادثة:\n${conversation}\n\nاكتب الرد المناسب الآن.`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    contents: prompt
  });
  return String(response.text || '').trim();
}

export async function analyzeLocationImage({ ai, image, note }) {
  const validated = validateImagePayload(image);
  const prompt = `حلل هذه الصورة كمستشار حلول زجاج معماري لشركة زجاج في الرياض. أعطِ بالعربية: 1) وصفاً مختصراً لما يظهر، 2) نوع تطبيق الزجاج المحتمل، 3) اقتراح حل مناسب مبدئي، 4) اعتبارات سلامة/تنفيذ عامة، 5) المعلومات الإضافية التي يجب طلبها من العميل. لا تستنتج قياسات دقيقة ولا تعط سعراً نهائياً. اختم بهذه العبارة حرفياً: "هذا اقتراح مبدئي بناءً على الصورة، والتسعير والتنفيذ النهائي يحتاجان إلى المقاسات والمعاينة الفعلية."\nملاحظة العميل: ${String(note || '').slice(0, 1500)}`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    contents: [
      { text: prompt },
      { inlineData: { mimeType: validated.mimeType, data: validated.data } }
    ]
  });
  return String(response.text || '').trim();
}

export async function generateAdminContent({ ai, task, title, content, image }) {
  const taskMap = {
    generate: 'أنشئ نصاً تسويقياً احترافياً ومقنعاً بالعربية مع الحفاظ على الدقة وعدم اختراع معلومات.',
    improve: 'حسّن النص العربي ليكون أوضح وأكثر احترافية وطبيعية بدون تغيير الحقائق.',
    seo: 'أنشئ JSON فقط بالمفاتيح metaTitle وmetaDescription وkeywords. اجعل العنوان مناسباً لمحركات البحث والوصف مختصراً والكلمات المفتاحية طبيعية مع تركيز محلي على الرياض عند صلته بالمحتوى.',
    alt: 'أنشئ Alt Text عربي قصيراً ووصفياً وطبيعياً للصورة، مناسباً لإتاحة الوصول وبدون حشو كلمات مفتاحية.'
  };
  const instruction = taskMap[task];
  if (!instruction) throw new Error('Unsupported AI task');

  const contents = [{ text: `${instruction}\nالعنوان: ${String(title || '').slice(0, 500)}\nالمحتوى: ${String(content || '').slice(0, 8000)}` }];
  if (image) {
    const validated = validateImagePayload(image);
    contents.push({ inlineData: { mimeType: validated.mimeType, data: validated.data } });
  }

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    contents,
    config: task === 'seo' ? { responseMimeType: 'application/json' } : undefined
  });
  return String(response.text || '').trim();
}
