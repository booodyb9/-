import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const DEFAULT_GEMINI_MODEL = 'gemini-3.6-flash';

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
    supabase: createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    }),
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

export async function requireAdmin(req) {
  const auth = req.headers.authorization || req.headers.Authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return null;

  const { supabaseUrl, supabaseAnonKey } = getServerConfig();
  const authedSupabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data: userData, error: userError } = await authedSupabase.auth.getUser(token);
  if (userError || !userData?.user) return null;

  const { data: admin, error: adminError } = await authedSupabase
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

function modelName() {
  return process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
}

export async function generateAssistantReply({ ai, supabase, messages }) {
  const safeMessages = Array.isArray(messages) ? messages.slice(-12) : [];
  const businessContext = await buildBusinessContext(supabase);
  const conversation = safeMessages.map((m) => `${m.role === 'assistant' ? 'المساعد' : 'العميل'}: ${String(m.content || '').slice(0, 2000)}`).join('\n');

  const prompt = `أنت مساعد مبيعات وخدمة عملاء لشركة زجاج الرياض. أجب بالعربية باختصار ووضوح. استخدم فقط معلومات الشركة والخدمات الموجودة في السياق أدناه. لا تخترع أسعاراً أو مواعيد أو خدمات غير موجودة. إذا احتاج العميل سعراً نهائياً، اطلب المقاسات والمعاينة أو وجّهه لطلب عرض سعر/واتساب. لا تدّع تنفيذ حجز أو طلب لم يتم فعلياً.\n\nسياق الشركة:\n${businessContext}\n\nالمحادثة:\n${conversation}\n\nاكتب الرد المناسب الآن.`;

  const response = await ai.models.generateContent({
    model: modelName(),
    contents: prompt
  });
  return String(response.text || '').trim();
}

export async function analyzeLocationImage({ ai, image, note }) {
  const validated = validateImagePayload(image);
  const prompt = `حلل هذه الصورة كمستشار حلول زجاج معماري لشركة زجاج في الرياض. أعطِ بالعربية: 1) وصفاً مختصراً لما يظهر، 2) نوع تطبيق الزجاج المحتمل، 3) اقتراح حل مناسب مبدئي، 4) اعتبارات سلامة/تنفيذ عامة، 5) المعلومات الإضافية التي يجب طلبها من العميل. لا تستنتج قياسات دقيقة ولا تعط سعراً نهائياً. اختم بهذه العبارة حرفياً: "هذا اقتراح مبدئي بناءً على الصورة، والتسعير والتنفيذ النهائي يحتاجان إلى المقاسات والمعاينة الفعلية."\nملاحظة العميل: ${String(note || '').slice(0, 1500)}`;

  const response = await ai.models.generateContent({
    model: modelName(),
    contents: [
      { text: prompt },
      { inlineData: { mimeType: validated.mimeType, data: validated.data } }
    ]
  });
  return String(response.text || '').trim();
}

export async function generateAdminContent({ ai, task, title, content, image, extraData }) {
  const taskMap = {
    generate: 'أنشئ نصاً تسويقياً احترافياً ومقنعاً بالعربية مع الحفاظ على الدقة وعدم اختراع معلومات.',
    improve: 'حسّن النص العربي ليكون أوضح وأكثر احترافية وطبيعية بدون تغيير الحقائق.',
    seo: 'أنشئ JSON فقط بالمفاتيح metaTitle وmetaDescription وkeywords. اجعل العنوان مناسباً لمحركات البحث والوصف مختصراً والكلمات المفتاحية طبيعية مع تركيز محلي على الرياض عند صلته بالمحتوى.',
    alt: 'أنشئ Alt Text عربي قصيراً ووصفياً وطبيعياً للصورة، مناسباً لإتاحة الوصول وبدون حشو كلمات مفتاحية.',
    analyze_image: 'حلل الصورة المرفقة. أعد JSON يحتوي على: categories (مصفوفة نصوص بأقسام الزجاج المحتملة)، suggestions (مصفوفة اقتراحات عناوين مناسبة)، confidence (رقم من 1-100 درجة الثقة). لا تفترض معلومات غير مؤكدة.',
    generate_service: 'بناءً على الصورة والمعطيات، أنشئ JSON للخدمة: title (عنوان الخدمة), shortDescription (وصف مختصر), content (محتوى HTML غني بالوسوم المناسبة), seoTitle, metaDescription, slug (حروف لاتينية وشرطات), keywords, altText.',
    generate_article: 'أنشئ مسودة مقال. أعد JSON: title (العنوان), content (محتوى المقال HTML غني بالعناوين الفرعية والمقاطع واقتراحات لروابط داخلية)، seoTitle, metaDescription, slug (حروف لاتينية), keywords, altText.',
    hero_optimize: 'حلل نص Hero Section. أعد JSON: title (H1 قوي), description (وصف احترافي), ctaText (نص زر), ctaLink (رابط افتراضي), altText (نص بديل). ركز على SEO ومجال الزجاج.',
    seo_intelligence: 'بناءً على سياق الموقع الحالي، استخرج الكلمات المفتاحية والموضوعات (Topics & Intents). أعد JSON يحتوي على مصفوفة مواضيع (Topics)، كل موضوع يحوي: keyword, intent (Commercial, Service, Informational, Local), suggestedPage (أفضل نوع صفحة لاستهدافها), priority (High, Medium, Low). لا تستخدم حشو الكلمات.',
    content_gaps: 'حلل سياق الموقع لاكتشاف فرص المحتوى (Content Gaps). أعد JSON بمصفوفة الفرص (opportunities)، كل فرصة: topic, missingContent (وصف لفرصة المحتوى), recommendation (نوع المحتوى المقترح مثل Article, Service Page), expectedImpact (High, Medium, Low).',
    seo_audit: 'راجع عناصر SEO في المحتوى المرسل واكتشف الأخطاء. أعد JSON بمصفوفة مشاكل (issues)، كل مشكلة: type (مثلاً missing_meta, missing_alt), message (وصف المشكلة), element (العنوان أو المعرف), priority (High, Medium, Low).',
    smart_search: 'أنت محرك بحث ذكي دلالي لشركة زجاج. بناءً على استعلام المستخدم (query)، ارجع قائمة بمعرفات (IDs) المحتوى الأكثر صلة. أعد JSON يحتوي على: matchedIds (مصفوفة من المعرفات).'
  };

  const instruction = taskMap[task];
  if (!instruction) throw new Error('Unsupported AI task: ' + task);

  const contents = [{ text: `${instruction}\nالمعطيات/العنوان: ${String(title || '').slice(0, 500)}\nالتفاصيل/المحتوى: ${String(content || extraData || '').slice(0, 24000)}` }];

  if (image) {
    const validated = validateImagePayload(image);
    contents.push({ inlineData: { mimeType: validated.mimeType, data: validated.data } });
  }

  const isJson = ['seo', 'analyze_image', 'generate_service', 'generate_article', 'hero_optimize', 'seo_intelligence', 'content_gaps', 'seo_audit', 'smart_search'].includes(task);

  const response = await ai.models.generateContent({
    model: modelName(),
    contents,
    config: isJson ? { responseMimeType: 'application/json' } : undefined
  });

  return String(response.text || '').trim();
}

export async function customerVisionAssistant({ ai, task, image, messages, supabase }) {
  const businessContext = await buildBusinessContext(supabase);
  
  if (task === 'analyze_initial') {
    const validated = validateImagePayload(image);
    const prompt = `أنت مساعد مبيعات ذكي متخصص في مجال الزجاج لشركة زجاج الرياض. 
العميل أرسل صورة لطلب تنفيذ عمل زجاجي بناءً عليها.
قم بتحليل الصورة.
أرجع فقط كائن JSON يحتوي على:
{
  "description": "وصف مبسط لما يظهر في الصورة كأنك تخاطب العميل، مثلا: يبدو أن الصورة تحتوي على باب زجاج سحاب...",
  "guessed_service": "تصنيف الخدمة المحتملة (مثلا: واجهات زجاج، كبائن شاور، درابزين، إلخ)",
  "options": ["أريد تنفيذ نفس التصميم تقريبًا", "أريد تصميمًا مشابهًا مع تعديلات", "لدي فكرة مختلفة"] // ضع خيارات مناسبة بناءً على الصورة لسؤال "ماذا تريد تنفيذه مقارنة بالصورة؟"
}
تجنب الجزم القاطع واستخدم "يبدو أن" أو "على الأرجح".
لا تقدم أي نصائح سلامة أو قياسات في هذه المرحلة.
إليك معلومات الشركة: ${businessContext}`;

    const response = await ai.models.generateContent({
      model: modelName(),
      contents: [
        { text: prompt },
        { inlineData: { mimeType: validated.mimeType, data: validated.data } }
      ],
      config: { responseMimeType: 'application/json' }
    });
    return String(response.text || '').trim();
  }
  
  if (task === 'chat') {
    let validated = null;
    if (image) validated = validateImagePayload(image);
    
    const safeMessages = Array.isArray(messages) ? messages.slice(-10) : [];
    const conversation = safeMessages.map((m) => `${m.role === 'assistant' ? 'المساعد' : 'العميل'}: ${String(m.content || '').slice(0, 1000)}`).join('\n');
    
    const prompt = `أنت مساعد مبيعات ذكي لشركة زجاج الرياض (تنفذ أعمال الزجاج المعماري).
هذه محادثة مع عميل يطلب تنفيذ عمل بناءً على صورة (تم تحليلها في بداية المحادثة).
دورك: جمع المتطلبات الأساسية بأقل عدد ممكن من الأسئلة.
- اسأل سؤالاً واحداً فقط في كل رد.
- إذا كانت الخدمة أبواب أو واجهات، اسأل عن المكان (داخلي/خارجي) أو نوع الفتح (مفصلي/سحاب).
- إذا كانت شاور، اسأل إذا كان زاوية أم واجهة.
- المقاسات: العميل يمكنه إعطاء مقاس تقريبي، ودائماً أكد أن المقاسات النهائية تعتمد على المعاينة الميدانية. لا تفترض أنت مقاساً، ولا تعطِ سعراً.
- إذا اكتملت المعلومات الأساسية (حوالي سؤالين أو ثلاثة)، أرجع {"is_complete": true, "summary": "ملخص كامل لطلب العميل", "reply": ""}
- إذا لم تكتمل، أرجع {"is_complete": false, "reply": "سؤالك التالي هنا...", "quick_replies": ["إجابة1", "إجابة2"]}

أرجع فقط JSON.
سياق الشركة: ${businessContext}

المحادثة الحالية:
${conversation}`;

    const contents = [{ text: prompt }];
    if (validated) {
        contents.push({ inlineData: { mimeType: validated.mimeType, data: validated.data } });
    }

    const response = await ai.models.generateContent({
      model: modelName(),
      contents,
      config: { responseMimeType: 'application/json' }
    });
    return String(response.text || '').trim();
  }

  throw new Error('Unsupported task for vision assistant');
}
