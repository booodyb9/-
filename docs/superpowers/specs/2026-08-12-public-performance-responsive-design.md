# Public Performance & Responsive Design

## Scope
Optimize the public Riyadh Glass website only. Preserve the current visual design, content, Supabase project, authentication, admin CRUD, dashboard behavior, Gemini API behavior, and existing routes.

## Strategy
Use a balanced performance pass: defer non-critical public enhancements until browser idle time, reduce per-frame/per-image JavaScript, preserve hero/primary navigation/WhatsApp availability, and add responsive safety without changing the brand layout.

## Public runtime
- Keep primary route rendering, Navbar/Hero/Footer and core CTA behavior unchanged.
- Do not mount AI lead assistant and proactive lead prompt during the critical initial render. Load them after browser idle time or a short fallback delay.
- Never mount public lead widgets on `/dashboard` routes.
- Keep Floating WhatsApp available immediately because it is a primary conversion action.

## Images
- Replace one IntersectionObserver per `LazyImage` with native browser lazy loading where possible.
- Use `decoding="async"` by default.
- Preserve explicit caller overrides and image dimensions/styles.
- Avoid expensive blurred loading overlays on every image.

## Ambient animation
- Keep the premium ambient background visually equivalent on capable desktop devices.
- Disable pointer tracking on coarse-pointer/touch devices.
- Respect `prefers-reduced-motion`.
- Throttle pointer-driven updates to animation frames rather than React state updates for every mouse event.

## Responsive safety
- Public pages must not create horizontal viewport overflow.
- Media must remain bounded by their containers.
- Floating UI must respect mobile safe areas.
- Do not alter dashboard components in this pass.

## Build boundaries
- Keep Dashboard route lazy-loaded.
- Keep AI widgets in their own asynchronous chunks and only request those chunks after idle time.
- Do not introduce new runtime dependencies.

## Verification
- `npm ci`
- `npm run lint`
- `npm run build`
- Verify generated bundle separates public AI chunks from initial route chunks.
- Verify no changes to Supabase schema, RLS, admin CRUD or auth files.
- After Netlify auto-deploy, test public home, services, portfolio, blog and mobile viewport behavior.
