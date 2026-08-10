import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildMessagePayload,
  createUniqueCopySlug,
  getContactHref,
  hasDuplicateSlug,
  inferMediaType,
  parseJsonArrayStrict,
  parsePageContent,
  removeById,
  upsertById,
} from '../src/pages/dashboard/dashboard-utils.mjs';

test('upsertById appends a newly-created form without changing the existing forms', () => {
  const forms = [{ id: 'contact', title: 'اتصل بنا' }];
  const created = { id: 'quote', title: 'طلب عرض سعر' };

  const result = upsertById(forms, created);

  assert.deepEqual(result, [forms[0], created]);
  assert.deepEqual(forms, [{ id: 'contact', title: 'اتصل بنا' }]);
});

test('upsertById replaces an existing form instead of duplicating it', () => {
  const result = upsertById(
    [{ id: 'contact', title: 'قديم' }, { id: 'quote', title: 'عرض سعر' }],
    { id: 'contact', title: 'جديد' },
  );

  assert.deepEqual(result, [
    { id: 'contact', title: 'جديد' },
    { id: 'quote', title: 'عرض سعر' },
  ]);
});

test('removeById returns the list that must be persisted after deletion', () => {
  assert.deepEqual(
    removeById([{ id: 'contact' }, { id: 'quote' }], 'contact'),
    [{ id: 'quote' }],
  );
});

test('parsePageContent reports malformed JSON without crashing the pages screen', () => {
  const result = parsePageContent({ key: 'page_bad', body: '{bad json' });

  assert.equal(result.parsed, null);
  assert.equal(result.parseError, true);
});

test('parsePageContent preserves valid page JSON', () => {
  const result = parsePageContent({
    key: 'page_about',
    body: '{"title":"من نحن","slug":"about"}',
  });

  assert.deepEqual(result.parsed, { title: 'من نحن', slug: 'about' });
  assert.equal(result.parseError, false);
});

test('parseJsonArrayStrict rejects malformed or non-array CMS content instead of replacing it', () => {
  assert.deepEqual(parseJsonArrayStrict('[{"id":1}]'), [{ id: 1 }]);
  assert.throws(() => parseJsonArrayStrict('{"id":1}'), /JSON array/);
  assert.throws(() => parseJsonArrayStrict('{broken'), /valid JSON/);
});

test('createUniqueCopySlug increments until the duplicated project slug is unique', () => {
  assert.equal(
    createUniqueCopySlug('glass-front', ['glass-front', 'glass-front-copy', 'glass-front-copy-2']),
    'glass-front-copy-3',
  );
});

test('hasDuplicateSlug ignores the project currently being edited', () => {
  const projects = [
    { id: 'a', slug: 'glass-front' },
    { id: 'b', slug: 'shower' },
  ];

  assert.equal(hasDuplicateSlug('glass-front', projects, 'a'), false);
  assert.equal(hasDuplicateSlug('glass-front', projects, 'b'), true);
});

test('getContactHref treats a phone stored in the legacy email field as a phone', () => {
  assert.equal(getContactHref('055 123 4567'), 'tel:0551234567');
  assert.equal(getContactHref('admin@example.com'), 'mailto:admin@example.com');
});

test('inferMediaType recognizes PDFs from MIME type or filename', () => {
  assert.equal(inferMediaType({ name: 'offer', type: 'application/pdf' }), 'pdf');
  assert.equal(inferMediaType({ name: 'offer.PDF', type: '' }), 'pdf');
  assert.equal(inferMediaType({ name: 'photo.webp', type: 'image/webp' }), 'image');
});

test('inferMediaType preserves normalized media types stored in the database', () => {
  assert.equal(inferMediaType({ name: 'asset', type: 'image' }), 'image');
  assert.equal(inferMediaType({ name: 'asset', type: 'video' }), 'video');
  assert.equal(inferMediaType({ name: 'asset', type: 'pdf' }), 'pdf');
});

test('buildMessagePayload keeps public forms compatible with the existing messages table', () => {
  assert.deepEqual(
    buildMessagePayload({
      name: 'أحمد',
      phone: '0551234567',
      service: 'واجهات',
      message: 'أحتاج عرض سعر',
      source: 'صفحة طلب عرض سعر',
    }),
    {
      name: 'أحمد',
      email: '0551234567',
      message: '[صفحة طلب عرض سعر] [الخدمة: واجهات] أحتاج عرض سعر',
      is_read: false,
    },
  );
});
