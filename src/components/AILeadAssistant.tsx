import { useMemo, useRef, useState } from 'react';
import { Bot, Camera, Send, X, Loader2, RotateCcw, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { computeLeadScore } from '../lib/leads';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || '').split(',')[1] || '');
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AILeadAssistant() {
  const location = useLocation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'أهلاً بك 👋 أنا مساعد زجاج الرياض. صف مشروعك أو أرسل صورة للمكان وسأساعدك في اختيار الحل المناسب.' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [leadOpen, setLeadOpen] = useState(false);
  const [lead, setLead] = useState({ name: '', phone: '', service: '' });
  const [leadSaved, setLeadSaved] = useState(false);

  const isAdminPath = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');
  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);
  if (isAdminPath) return null;

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: 'user' as const, content: text }];
    setMessages(next);
    setInput('');
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: next })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'تعذر الرد الآن');
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'تعذر الاتصال بالمساعد حالياً');
    } finally {
      setLoading(false);
    }
  };

  const analyzeImage = async (file?: File) => {
    if (!file || loading) return;
    setError('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('استخدم صورة JPG أو PNG أو WebP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الصورة يجب ألا يتجاوز 5MB.');
      return;
    }
    setLoading(true);
    try {
      const data = await fileToBase64(file);
      const response = await fetch('/api/ai/image', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ image: { mimeType: file.type, data }, note: input.trim() })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'تعذر تحليل الصورة');
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: `📷 أرسلت صورة للمكان${input.trim() ? ` — ${input.trim()}` : ''}` },
        { role: 'assistant', content: payload.analysis }
      ]);
      setInput('');
      setLeadOpen(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'تعذر تحليل الصورة حالياً');
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const saveLead = async () => {
    if (!lead.phone.trim()) {
      setError('أدخل رقم الجوال للتواصل.');
      return;
    }
    const { score, temperature } = computeLeadScore({ hasContactDetails: true, usedAiAssistant: true, uploadedImage: messages.some((m) => m.content.includes('📷')) });
    const { error: insertError } = await supabase.from('leads').insert({
      name: lead.name.trim() || null,
      phone: lead.phone.trim(),
      service: lead.service.trim() || null,
      source: messages.some((m) => m.content.includes('📷')) ? 'image_analysis' : 'ai_assistant',
      source_context: { path: location.pathname },
      message: messages.slice(-4).map((m) => `${m.role}: ${m.content}`).join('\n'),
      status: 'new',
      score,
      temperature
    });
    if (insertError) {
      setError('تعذر حفظ طلب التواصل. يمكنك التواصل معنا مباشرة عبر واتساب.');
      return;
    }
    setLeadSaved(true);
    setLeadOpen(false);
  };

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 z-[90]" dir="rtl">
      {open && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-[390px] h-[min(70vh,600px)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold"><Sparkles className="w-5 h-5 text-sky-400" /> مساعد زجاج الرياض</div>
            <button onClick={() => setOpen(false)} aria-label="إغلاق المساعد"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 whitespace-pre-wrap ${m.role === 'user' ? 'mr-auto bg-sky-600 text-white rounded-bl-sm' : 'ml-auto bg-white border text-slate-800 rounded-br-sm'}`}>
                {m.content}
              </div>
            ))}
            {loading && <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="w-4 h-4 animate-spin" /> جاري التفكير...</div>}
            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl">{error}</div>}
            {leadSaved && <div className="text-sm text-green-700 bg-green-50 border border-green-100 p-3 rounded-xl">تم تسجيل طلبك بنجاح وسيتواصل معك الفريق.</div>}
            {leadOpen && !leadSaved && (
              <div className="bg-white border rounded-2xl p-3 space-y-2">
                <div className="font-bold text-sm">هل تريد معاينة أو تواصل من الفريق؟</div>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="الاسم (اختياري)" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} />
                <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="رقم الجوال" dir="ltr" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} />
                <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="الخدمة المطلوبة (اختياري)" value={lead.service} onChange={(e) => setLead({ ...lead, service: e.target.value })} />
                <button onClick={saveLead} className="w-full bg-sky-600 text-white rounded-lg py-2 font-bold text-sm">إرسال طلب التواصل</button>
              </div>
            )}
          </div>
          <div className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <button onClick={() => fileRef.current?.click()} className="shrink-0 w-11 h-11 rounded-xl border flex items-center justify-center" title="إرسال صورة"><Camera className="w-5 h-5" /></button>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="hidden" onChange={(e) => analyzeImage(e.target.files?.[0])} />
              <input className="flex-1 min-w-0 border rounded-xl px-3 text-sm" placeholder="اكتب سؤالك..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} />
              <button disabled={!canSend} onClick={send} className="shrink-0 w-11 h-11 rounded-xl bg-sky-600 text-white flex items-center justify-center disabled:opacity-40"><Send className="w-5 h-5" /></button>
            </div>
            <div className="mt-2 flex justify-between items-center text-[11px] text-slate-500">
              <span>تحليل الصور مبدئي ويحتاج معاينة ومقاسات فعلية.</span>
              <button onClick={() => { setMessages(messages.slice(0, 1)); setLeadSaved(false); setError(''); }} className="flex items-center gap-1"><RotateCcw className="w-3 h-3" /> مسح</button>
            </div>
          </div>
        </div>
      )}
      <button onClick={() => setOpen((v) => !v)} className="ml-auto w-14 h-14 rounded-full bg-slate-950 text-white shadow-2xl flex items-center justify-center border-2 border-white" aria-label="مساعد زجاج الرياض">
        {open ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>
    </div>
  );
}
