export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#F9FAFB]" aria-hidden="true">
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#0284C7]/10 blur-[100px]" />
      <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-300/10 blur-[120px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.8)_0%,rgba(255,255,255,0.2)_100%)] mix-blend-overlay" />
    </div>
  );
}
