# Riyadh Glass Experimental AI + CRM Design

## Objective
Create an isolated experimental upgrade of the current Riyadh Glass project without changing `main`, the production deployment, the existing Supabase project, or existing production data. The experiment must repair dashboard reliability first, then add Gemini AI and lead-conversion capabilities, and finally validate the whole Admin → Supabase → Public flow before any production decision.

## Isolation Strategy
- Work only on branch `experimental-ai-crm`.
- Do not merge to `main` during implementation or testing.
- Do not deploy to the existing production Netlify site.
- Use a separate Netlify preview/experimental deployment only after local/build verification.
- Keep the existing Supabase project and data. Any schema change must be additive, idempotent, and backward-compatible.

## Phase 1 — Dashboard Reliability and Data Flow
Repair the existing dashboard and ensure every successful admin change persists to Supabase and is reflected in the public site after refresh.

Scope:
- Fix empty/placeholder dashboard sections instead of deleting them.
- Fix Messages: phone/email separation, read/unread, status, archive/delete, search/filter, unread count.
- Fix Form Builder persistence, including delete and select options.
- Fix Media Library filters and Storage ↔ media-table consistency.
- Fix Portfolio/Projects: uploads for cover/gallery/before/after/SEO images, unique slugs, hidden projects blocked from public direct URLs, not-found state.
- Fix Bulk Gallery Upload so images do not become independent featured projects by default.
- Fix Pages Manager safe JSON parsing and non-functional controls.
- Fix Homepage Builder so `homepage_sections` actually controls public section order/visibility.
- Unify or synchronize settings sources (`site_settings`, `company_info`, `seo_settings`, `social_links`) without data loss.
- Replace hard-coded phone/WhatsApp/company values with settings-backed values.
- Remove fake dashboard analytics/activity and show real data or explicit no-data states.
- Make backup labeling truthful: local JSON download unless real Google Drive upload exists.
- Keep Realtime centralized and free of duplicate channels/memory leaks.

Success criteria:
- Admin edit → Supabase save → public update → refresh persistence.
- No false success messages.
- No dashboard menu item opens a blank screen.

## Phase 2 — Gemini AI Layer
Add Gemini only through server-side endpoints. Never expose `GEMINI_API_KEY` to the browser or GitHub.

### Public AI Assistant
- Small floating widget: “مساعد زجاج الرياض”.
- Arabic-first concise assistance using current CMS/service data.
- Guides users to the appropriate service and relevant CTA.
- Must not invent pricing, availability, bookings, or unsupported services.
- Mobile-safe and non-overlapping with calculator/WhatsApp widgets.

### Image Analysis
- Same widget supports camera/image upload.
- Validate image type and size client-side and server-side.
- Gemini analyzes the location and suggests a likely glass solution.
- Never claim precise measurements or final pricing from an image.
- Always state that final pricing/execution requires actual measurements/site inspection.
- Do not permanently store customer images unless explicitly needed and consented.

### Admin AI Tools
Add review-before-save AI actions inside Services, Projects, and Blog forms:
- Generate content
- Improve text
- Generate SEO
- Generate image Alt Text

AI output fills editable fields only; publishing remains an explicit admin action.

### AI Security
- Use the current official Google GenAI SDK compatible with the project stack.
- `GEMINI_API_KEY` server-side only.
- Real runtime env vars only; never `.env.example` as runtime config.
- Validation, payload limits, timeouts, application-level rate limiting, safe errors.
- Admin AI endpoints must verify admin authorization.
- Handle 400/401/403/429/5xx gracefully.

## Phase 3 — Lead Conversion + Mini CRM
Turn meaningful visitor intent into consent-based leads without aggressive popups or unsolicited messaging.

### Smart Engagement
Trigger context-aware prompts only after meaningful signals such as:
- time spent / scroll depth
- viewing service or project detail
- opening calculator
- using AI assistant
- uploading an image

Examples:
- Shower page → “احصل على تقدير مبدئي للشاور”.
- Project detail → “أريد تصميمًا مشابهًا”.
- Calculator result → “أرسل التقدير إلى واتساب / اطلب عرض سعر دقيق”.
- Image analysis → “اطلب معاينة لهذا الحل”.

Do not immediately interrupt every visitor and do not auto-send WhatsApp messages without user action/consent.

### Lead Capture
Store only after the visitor voluntarily submits details. Core fields:
- id
- name
- phone
- email (optional)
- service
- source
- source_context
- message/notes
- status
- score
- created_at
- updated_at
- last_activity_at
- follow_up_at (optional)
- assigned_admin (optional)

Sources should include AI Assistant, Image Analysis, Calculator, Service Page, Project Page, Contact Form, Quote Form, WhatsApp handoff, and other real conversion paths.

### Lead Scoring
Use transparent deterministic signals rather than opaque AI claims. Example weights can include:
- submitted phone/contact details
- requested quote
- uploaded image
- used calculator
- opened WhatsApp handoff
- revisited high-intent pages

Expose score and Hot/Warm/Cold label in admin, with rules documented in code/config.

### Mini CRM
Add admin lead management with:
- New
- Contacted
- Interested
- Quote Sent
- Won
- Lost/Closed

Functions:
- search/filter
- notes
- source
- score
- status
- follow-up date
- assigned admin when supported safely
- activity timeline for meaningful admin/lead events

### Conversion Analytics
Use only real stored data. Show:
- total leads
- leads by source
- leads by service
- hot/warm/cold distribution
- status funnel
- calculator conversions
- AI conversions
- image-analysis conversions
- WhatsApp handoff clicks
- quote completions

If visitor analytics are not available, show no-data rather than fabricated traffic metrics.

## Floating Widget Coordination
The public site may have WhatsApp, Cost Calculator, and AI Assistant. They must:
- never overlap on mobile
- have consistent spacing and z-index rules
- not block form controls or navigation
- preserve the current design language

## Data Safety
Before any migration:
- inspect current schema
- prefer extending existing tables/keys
- no `DROP TABLE`, `TRUNCATE`, database reset, project replacement, or destructive rewrite
- migrations must be idempotent and preserve existing rows

## SEO and Settings
- Ensure public SEO reads real settings.
- Use one consistent slug strategy across admin, public routes, sitemap, and canonical URLs.
- Keep LocalBusiness/Service/FAQ/Article/Breadcrumb structured data tied to real content.
- Do not generate mass low-quality local pages.

## Performance
The AI/CRM upgrade must not significantly degrade the public site:
- lazy-load AI UI and heavy dependencies where possible
- avoid loading image-analysis code until needed
- compress/validate uploaded images
- preserve code splitting
- avoid duplicate realtime subscriptions

## Testing Gates
After each phase:
1. TypeScript/type-check if configured.
2. Production build.
3. Verify relevant CRUD/data flows.
4. Verify mobile behavior.
5. Stop and fix regressions before continuing.

Final end-to-end checks:
- Admin login/authorization
- Services/Projects/Blog CRUD
- Messages/Leads/Forms
- Media upload/delete and storage consistency
- Homepage section ordering/visibility
- Settings propagation
- AI text request
- AI image request
- invalid/oversized image handling
- missing Gemini key
- 429/API failure behavior
- unauthorized admin AI request
- lead capture from each conversion source
- CRM status/notes/follow-up persistence
- Admin → Supabase → Public consistency

## Netlify Preview Rule
Only after build/tests pass, deploy this branch to an isolated Netlify preview/experimental target. Do not overwrite the existing production site or domain. The preview must use the required environment variables without exposing secrets.

## Non-Goals
- No redesign of the current public visual identity.
- No Supabase project migration.
- No production deployment.
- No automatic WhatsApp outreach to visitors without consent.
- No automatic AI publishing.
- No fake analytics, fake CRM events, or invented prices.
