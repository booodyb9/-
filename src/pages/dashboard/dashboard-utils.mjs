export function upsertById(items, item) {
  const index = items.findIndex((existing) => existing.id === item.id);
  if (index === -1) return [...items, item];

  return items.map((existing, itemIndex) => itemIndex === index ? item : existing);
}

export function removeById(items, id) {
  return items.filter((item) => item.id !== id);
}

export function parsePageContent(page) {
  if (page?.parsed && typeof page.parsed === 'object' && !Array.isArray(page.parsed)) {
    return { ...page, parseError: false };
  }

  try {
    const parsed = page?.body ? JSON.parse(page.body) : {};
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new TypeError('Page content must be a JSON object');
    }
    return { ...page, parsed, parseError: false };
  } catch {
    return { ...page, parsed: null, parseError: true };
  }
}

export function parseJsonArrayStrict(value) {
  let parsed;
  try {
    parsed = JSON.parse(value || '[]');
  } catch {
    throw new Error('CMS content is not valid JSON');
  }
  if (!Array.isArray(parsed)) {
    throw new TypeError('CMS content must be a JSON array');
  }
  return parsed;
}

export function createUniqueCopySlug(originalSlug, existingSlugs) {
  const base = `${String(originalSlug || 'project').replace(/-copy(?:-\d+)?$/, '')}-copy`;
  const taken = new Set(existingSlugs.filter(Boolean));
  if (!taken.has(base)) return base;

  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

export function hasDuplicateSlug(slug, items, currentId) {
  const normalized = String(slug || '').trim();
  return items.some((item) => item.id !== currentId && String(item.slug || '').trim() === normalized);
}

export function getContactHref(contact) {
  const value = String(contact || '').trim();
  if (value.includes('@')) return `mailto:${value}`;
  return `tel:${value.replace(/[^\d+]/g, '')}`;
}

export function inferMediaType(file) {
  const mime = String(file?.type || '').toLowerCase();
  const filename = String(file?.name || file?.url || '').toLowerCase().split('?')[0];

  if (['image', 'video', 'pdf'].includes(mime)) return mime;
  if (mime.startsWith('image/') || /\.(jpe?g|png|gif|webp|svg|avif)$/.test(filename)) return 'image';
  if (mime.startsWith('video/') || /\.(mp4|webm|ogg|mov)$/.test(filename)) return 'video';
  if (mime === 'application/pdf' || filename.endsWith('.pdf')) return 'pdf';
  return 'other';
}

export function buildMessagePayload({ name, phone, service, message, source }) {
  const parts = [];
  if (source) parts.push(`[${String(source).trim()}]`);
  if (service) parts.push(`[الخدمة: ${String(service).trim()}]`);
  if (message) parts.push(String(message).trim());

  return {
    name: String(name || '').trim(),
    email: String(phone || '').trim(),
    message: parts.join(' '),
    is_read: false,
  };
}
