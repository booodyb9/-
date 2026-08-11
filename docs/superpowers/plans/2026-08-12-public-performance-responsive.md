# Public Performance & Responsive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve public-site startup performance, loading behavior, and cross-device responsiveness without changing Admin/Supabase behavior or the visual identity.

**Architecture:** Keep critical public UI eager, defer non-critical lead/AI enhancements until idle time, simplify image loading to native browser capabilities, and reduce animation work on touch/reduced-motion devices. Changes are isolated to public runtime components and global responsive safety CSS.

**Tech Stack:** React 19, Vite 6, TypeScript, Tailwind CSS 4, motion/react.

## Global Constraints
- Do not modify Supabase schema, RLS, auth, CRUD logic, or admin data flows.
- Do not redesign the current public UI.
- Keep WhatsApp CTA immediately available.
- Do not add dependencies.
- Keep `main` untouched; work only on `experimental-ai-crm`.

---

### Task 1: Defer non-critical public widgets

**Files:**
- Create: `src/components/DeferredPublicEnhancements.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- `DeferredPublicEnhancements(): JSX.Element | null` mounts `AILeadAssistant` and `SmartLeadPrompt` after `requestIdleCallback` or 1200ms fallback and returns null on dashboard routes.

- [ ] Create the component with lazy imports and idle scheduling.
- [ ] Replace direct AI/lead lazy rendering in `App.tsx` with the deferred component.
- [ ] Run `npm run lint` and expect PASS.

### Task 2: Simplify LazyImage runtime work

**Files:**
- Modify: `src/components/LazyImage.tsx`

**Interfaces:**
- Preserve existing `src`, `alt`, `className`, and standard `img` props.
- Default to `loading="lazy"` and `decoding="async"`, while honoring explicit caller values.

- [ ] Remove per-image IntersectionObserver and blur spinner overlay.
- [ ] Keep a lightweight opacity transition driven only by `onLoad`.
- [ ] Run `npm run lint` and expect PASS.

### Task 3: Reduce ambient animation cost

**Files:**
- Modify: `src/components/AmbientBackground.tsx`

**Interfaces:**
- Preserve current background appearance on desktop.
- No pointer tracking on coarse pointers or reduced-motion devices.
- Pointer updates occur at most once per animation frame.

- [ ] Add media-query capability checks.
- [ ] Use requestAnimationFrame throttling for pointer tracking.
- [ ] Disable infinite motion when reduced motion is requested.
- [ ] Run `npm run lint` and expect PASS.

### Task 4: Public responsive safety

**Files:**
- Modify: `src/index.css`

**Interfaces:**
- No horizontal viewport overflow from public content.
- Media elements remain container-bounded.
- Floating elements can use safe-area insets.

- [ ] Add conservative global overflow/media rules that do not override component sizing utilities.
- [ ] Add reduced-motion fallback for non-essential transitions/animations.
- [ ] Run `npm run lint` and expect PASS.

### Task 5: Bundle verification

**Files:**
- No new files.

- [ ] Run `npm ci`.
- [ ] Run `npm run lint`; expect PASS.
- [ ] Run `npm run build`; expect PASS.
- [ ] Confirm AI/lead components remain separate async chunks and Dashboard remains lazy.
- [ ] Confirm diff does not include Supabase migrations, auth, dashboard CRUD or RLS changes in this performance pass.
