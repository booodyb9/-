import { useEffect, useMemo, useRef, useState } from 'react';
import { Volume2, VolumeX, X } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

const SESSION_KEY = 'riyadh-glass-brand-intro-seen';

export default function BrandIntro() {
  const { getContent } = useContent();
  const settingsContent = getContent('site_settings');
  const [visible, setVisible] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const settings = useMemo(() => {
    try { return settingsContent?.body ? JSON.parse(settingsContent.body) : {}; } catch { return {}; }
  }, [settingsContent]);

  const enabled = settings.introEnabled !== false;
  const duration = Math.min(Math.max(Number(settings.introDuration || 2.2), 1.2), 4) * 1000;
  const title = settings.introText || 'زجاج الرياض';
  const logo = settings.introLogoUrl || settings.logoUrl || '/apple-touch-icon.png';
  const audioUrl = settings.introAudioUrl || '';
  const soundEnabled = settings.introSoundEnabled !== false;

  useEffect(() => {
    if (!enabled || window.sessionStorage.getItem(SESSION_KEY)) return;
    setVisible(true);
    const timer = window.setTimeout(() => {
      setVisible(false);
      window.sessionStorage.setItem(SESSION_KEY, '1');
    }, duration);
    return () => window.clearTimeout(timer);
  }, [enabled, duration]);

  useEffect(() => {
    if (!visible || !audioUrl || !soundEnabled || muted || !audioRef.current) return;
    const audio = audioRef.current;
    audio.volume = 0.9;
    audio.play().catch(() => {
      const playOnFirstInteraction = () => {
        audio.play().catch(() => undefined);
        window.removeEventListener('pointerdown', playOnFirstInteraction);
      };
      window.addEventListener('pointerdown', playOnFirstInteraction, { once: true });
    });
  }, [visible, audioUrl, soundEnabled, muted]);

  if (!visible) return null;

  const skip = () => {
    setVisible(false);
    window.sessionStorage.setItem(SESSION_KEY, '1');
    audioRef.current?.pause();
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden bg-[radial-gradient(circle_at_50%_30%,#ffffff_0%,#f4fbff_46%,#e9f6fc_100%)] flex items-center justify-center" dir="rtl">
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}
      <div className="absolute inset-0 opacity-70 pointer-events-none bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,.9)_48%,transparent_61%)] intro-light-sweep" />
      <button onClick={skip} className="absolute top-5 left-5 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/75 px-3 py-2 text-xs font-bold text-slate-600 backdrop-blur-xl" aria-label="تخطي المقدمة">
        <X className="w-4 h-4" /> تخطي
      </button>
      {audioUrl && soundEnabled && (
        <button onClick={() => setMuted((v) => !v)} className="absolute top-5 right-5 w-10 h-10 rounded-full border border-slate-200 bg-white/75 text-slate-600 backdrop-blur-xl flex items-center justify-center" aria-label={muted ? 'تشغيل الصوت' : 'كتم الصوت'}>
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      )}
      <div className="relative text-center px-6 intro-brand-wrap">
        <div className="mx-auto mb-5 w-28 h-28 sm:w-36 sm:h-36 rounded-[2rem] border border-white/90 bg-white/55 shadow-[0_30px_80px_rgba(2,132,199,.18)] backdrop-blur-2xl p-5 intro-glass-logo">
          <img src={logo} alt={title} className="w-full h-full object-contain" decoding="async" />
        </div>
        <div className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 intro-brand-title">{title}</div>
        <div className="mx-auto mt-4 h-px w-28 bg-gradient-to-r from-transparent via-sky-400 to-transparent intro-brand-line" />
      </div>
    </div>
  );
}
