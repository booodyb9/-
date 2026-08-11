# Riyadh Glass AI + CRM Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repair the current dashboard/data flow, add secure Gemini AI features, add consent-based lead conversion + mini CRM, and publish only an isolated Netlify preview after full verification.

**Architecture:** Keep the existing React/Vite + Express + Supabase architecture. Centralize public content through `ContentContext`, keep Gemini calls server-side, add additive/idempotent Supabase migrations for leads/messages/activity, and keep all work isolated on `experimental-ai-crm`.

**Tech Stack:** React 19, TypeScript, Vite, Express, Supabase JS/Auth/Realtime/Storage, `@google/genai`, Tailwind CSS, React Router, Swiper.

## Global Constraints
- Work only on branch `experimental-ai-crm`.
- Do not merge to `main` during implementation/testing.
- Do not overwrite the current Netlify production site/domain.
- Keep the existing Supabase project and production rows.
- Schema changes must be additive, idempotent, and backward-compatible.
- No redesign of the current public visual identity.
- No automatic WhatsApp outreach without visitor action/consent.
- No automatic AI publishing.
- No fabricated analytics, prices, activities, or CRM events.
- `GEMINI_API_KEY` is server-side only and never committed.

---

### Task 1: Safe data foundation and schema compatibility
**Files:** create `src/lib/safeJson.ts`, `src/lib/settings.ts`, `src/lib/leads.ts`, `supabase/migrations/20260812_ai_crm_upgrade.sql`; modify `src/pages/dashboard/types.ts`.

- [ ] Add focused tests for malformed JSON, legacy settings fallback, deterministic lead scoring.
- [ ] Implement `safeParseJson<T>()`, canonical settings resolver, and lead score helper.
- [ ] Add additive/idempotent migration for message fields, leads, lead activities, admin activity fields, indexes/checks/RLS.
- [ ] Run type-check/tests/build.
- [ ] Commit.

### Task 2: Repair Admin → Supabase → Public reliability
**Files:** modify `src/contexts/ContentContext.tsx`, `src/pages/dashboard/HomepageBuilder.tsx`, `src/pages/public/Home.tsx`, `src/pages/dashboard/PagesManager.tsx`, `src/pages/dashboard/FormBuilder.tsx`, `src/pages/dashboard/SiteSettings.tsx`, `src/components/Contact.tsx`, `src/components/SEO.tsx`, `src/pages/public/ProjectDetails.tsx`.

- [ ] Make homepage order/visibility read from persisted `homepage_sections`.
- [ ] Replace unsafe JSON parsing with safe helpers.
- [ ] Persist FormBuilder deletion/select options.
- [ ] Unify settings reads without destructive migration; replace hardcoded phone/WhatsApp/company values.
- [ ] Fix contact phone/email mapping.
- [ ] Ensure hidden projects return real not-found state and never appear in related/public lists.
- [ ] Run type-check/tests/build and verify refresh persistence.
- [ ] Commit.

### Task 3: Media + project upload consistency
**Files:** modify `src/pages/dashboard/MediaLibrary.tsx`, `src/pages/dashboard/ArrayEditor.tsx`, `src/pages/dashboard/PortfolioManager.tsx`, `src/pages/dashboard/BulkGalleryUpload.tsx`.

- [ ] Fix document/pdf filter type mismatch.
- [ ] Ensure Storage upload + DB insert behave transactionally with cleanup on partial failure.
- [ ] Ensure delete reports success only after intended deletes succeed.
- [ ] Add device uploads for cover/gallery/before/after/SEO images.
- [ ] Add unique slug validation and immutable updates.
- [ ] Change bulk upload so images attach to a chosen project/gallery instead of auto-creating featured projects.
- [ ] Run type-check/tests/build.
- [ ] Commit.

### Task 4: Messages, real dashboard metrics, CRM and conversion analytics
**Files:** modify `src/pages/Dashboard.tsx`, `src/pages/dashboard/config.ts`, `src/pages/dashboard/Messages.tsx`, `src/pages/dashboard/DashboardHome.tsx`; create `src/pages/dashboard/LeadsManager.tsx`, `src/pages/dashboard/ConversionAnalytics.tsx`.

- [ ] Add message view/read/unread/status/archive/delete/search/filter.
- [ ] Add Leads CRM with status, source, score, notes, follow-up, assignment when supported safely.
- [ ] Add activity timeline from real stored events.
- [ ] Replace fake dashboard metrics/activity with real counts or explicit no-data.
- [ ] Add conversion analytics from stored lead data only.
- [ ] Ensure no dashboard menu item opens blank content.
- [ ] Run type-check/tests/build.
- [ ] Commit.

### Task 5: Secure Gemini backend
**Files:** modify `server.js`; optionally create focused modules under `server/` if needed; update `package.json` only if dependency changes are required.

- [ ] Stop loading runtime secrets from `.env.example`.
- [ ] Validate required runtime env vars and never expose/log secrets.
- [ ] Add server-side rate limiting, payload limits, timeout handling, safe error mapping.
- [ ] Add admin-authenticated endpoints for content/SEO/alt-text generation.
- [ ] Add public assistant endpoint grounded in current CMS/services.
- [ ] Add image-analysis endpoint with file validation and no permanent storage by default.
- [ ] Handle 400/401/403/429/5xx and missing key cases.
- [ ] Run backend smoke tests/type-check/build.
- [ ] Commit.

### Task 6: Public AI assistant + image analysis + floating widget coordination
**Files:** create `src/components/AILeadAssistant.tsx`, `src/components/FloatingWidgetDock.tsx`; modify `src/pages/public/Home.tsx` and relevant shared layout/widget files.

- [ ] Add lazy Arabic-first assistant widget.
- [ ] Add camera/image upload flow to same widget.
- [ ] Show mandatory provisional-analysis disclaimer.
- [ ] Add retry/loading/error/clear/minimize states.
- [ ] Coordinate AI, calculator, WhatsApp spacing/z-index on mobile.
- [ ] Confirm calculator stays out of footer and remains modal/widget based.
- [ ] Run mobile viewport checks and build.
- [ ] Commit.

### Task 7: Admin AI tools
**Files:** modify service editor/`ArrayEditor.tsx`, `PortfolioManager.tsx`, blog editor/content manager files.

- [ ] Add Generate, Improve, SEO, Alt Text actions.
- [ ] Require admin auth for every AI admin request.
- [ ] Fill editable fields only; never auto-save/publish.
- [ ] Add progress/error states and preserve manual edits.
- [ ] Run type-check/tests/build.
- [ ] Commit.

### Task 8: Lead conversion engine
**Files:** create `src/components/SmartLeadPrompt.tsx`; modify service/project/contact/quote/calculator/AI paths and `src/lib/leads.ts`.

- [ ] Trigger context-aware prompts only after meaningful intent signals.
- [ ] Add lead capture with explicit voluntary submission.
- [ ] Track source/source_context for AI, image, calculator, service, project, contact, quote, WhatsApp handoff.
- [ ] Add deterministic Hot/Warm/Cold scoring.
- [ ] Add Project → Quote, Calculator → Lead, Image Analysis → Lead handoffs.
- [ ] Add WhatsApp handoff only after user action/consent.
- [ ] Run end-to-end lead persistence tests.
- [ ] Commit.

### Task 9: Auth, users/roles/activity, backup truthfulness, realtime cleanup
**Files:** modify `src/components/AdminRoute.tsx`, `src/contexts/AuthContext.tsx`, admin user/role/activity components or create focused ones, `src/pages/dashboard/DriveBackup.tsx`, `src/contexts/ContentContext.tsx`.

- [ ] Remove public admin signup UI if present while preserving existing admins.
- [ ] Keep admin authorization enforced against current admin model/RLS.
- [ ] Implement users/roles/activity views safely or clearly disable unsupported write actions with reason; no blank pages.
- [ ] Ensure backup UI says local JSON unless real Drive upload exists.
- [ ] Remove duplicate realtime channels/listeners and ensure cleanup.
- [ ] Run auth/realtime/build checks.
- [ ] Commit.

### Task 10: Final verification and isolated Netlify preview
**Files:** no production changes; only test/config adjustments if required.

- [ ] Run TypeScript/type-check.
- [ ] Run full production build.
- [ ] Verify Admin login/authorization.
- [ ] Verify Services/Projects/Blog CRUD, Messages, Leads, Forms, Pages, Homepage Builder, Settings.
- [ ] Verify Media upload/multi-upload/replace/delete consistency.
- [ ] Verify Admin edit → Supabase → Public → refresh persistence.
- [ ] Verify Gemini text, image, invalid/oversized image, missing key, 429/API failure, unauthorized admin AI request.
- [ ] Verify lead capture from every conversion source and CRM persistence.
- [ ] Verify mobile layout and floating widgets.
- [ ] Deploy only to an isolated Netlify preview/experimental target; never overwrite production.
- [ ] Open/check the preview URL and dashboard routes available without credentials; report any auth-only verification that requires user credentials.
- [ ] Commit final verification notes if needed.
