from pathlib import Path
import re


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise RuntimeError(f'Missing expected block: {label}')
    return text.replace(old, new, 1)

# Portfolio: replace every manual image URL editor with device upload controls.
portfolio_path = Path('src/pages/dashboard/PortfolioManager.tsx')
portfolio = portfolio_path.read_text()
if "./ImageUploadField" not in portfolio:
    portfolio = portfolio.replace(
        "import { useContent } from '../../contexts/ContentContext';",
        "import { useContent } from '../../contexts/ContentContext';\nimport ImageUploadField from './ImageUploadField';\nimport MultiImageUploadField from './MultiImageUploadField';",
    )

portfolio = replace_once(
    portfolio,
    '''          <div>\n            <label className="block text-sm font-medium mb-1">صورة الغلاف (Cover Image URL)</label>\n            <input\n              type="text"\n              value={currentProject.coverImage || ''}\n              onChange={e => setCurrentProject({ ...currentProject, coverImage: e.target.value })}\n              className="w-full border p-2 rounded"\n              dir="ltr"\n            />\n          </div>''',
    '''          <ImageUploadField\n            label="صورة الغلاف"\n            value={currentProject.coverImage || ''}\n            folder="portfolio/covers"\n            onChange={(url) => setCurrentProject({ ...currentProject, coverImage: url })}\n          />''',
    'portfolio cover image',
)

portfolio = replace_once(
    portfolio,
    '''          <div>\n            <label className="block text-sm font-medium mb-1">معرض الصور (رابط لكل سطر)</label>\n            <textarea\n              value={currentProject.galleryImages?.join('\\n') || ''}\n              onChange={e => setCurrentProject({ ...currentProject, galleryImages: e.target.value.split('\\n').filter(Boolean) })}\n              className="w-full border p-2 rounded h-32"\n              dir="ltr"\n            />\n          </div>''',
    '''          <MultiImageUploadField\n            label="معرض صور المشروع"\n            values={currentProject.galleryImages || []}\n            folder="portfolio/gallery"\n            onChange={(galleryImages) => setCurrentProject({ ...currentProject, galleryImages })}\n          />''',
    'portfolio gallery images',
)

portfolio = replace_once(
    portfolio,
    '''             <div>\n              <label className="block text-sm font-medium mb-1">صورة قبل (Before Image URL)</label>\n              <input\n                type="text"\n                value={currentProject.beforeImage || ''}\n                onChange={e => setCurrentProject({ ...currentProject, beforeImage: e.target.value })}\n                className="w-full border p-2 rounded"\n                dir="ltr"\n              />\n            </div>''',
    '''            <ImageUploadField\n              label="صورة قبل التنفيذ"\n              value={currentProject.beforeImage || ''}\n              folder="portfolio/before"\n              onChange={(url) => setCurrentProject({ ...currentProject, beforeImage: url })}\n            />''',
    'portfolio before image',
)

portfolio = replace_once(
    portfolio,
    '''            <div>\n              <label className="block text-sm font-medium mb-1">صورة بعد (After Image URL)</label>\n              <input\n                type="text"\n                value={currentProject.afterImage || ''}\n                onChange={e => setCurrentProject({ ...currentProject, afterImage: e.target.value })}\n                className="w-full border p-2 rounded"\n                dir="ltr"\n              />\n            </div>''',
    '''            <ImageUploadField\n              label="صورة بعد التنفيذ"\n              value={currentProject.afterImage || ''}\n              folder="portfolio/after"\n              onChange={(url) => setCurrentProject({ ...currentProject, afterImage: url })}\n            />''',
    'portfolio after image',
)
portfolio_path.write_text(portfolio)

# Pages: featured image must come from device.
pages_path = Path('src/pages/dashboard/PagesManager.tsx')
pages = pages_path.read_text()
if "./ImageUploadField" not in pages:
    pages = pages.replace(
        "import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';",
        "import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';\nimport ImageUploadField from './ImageUploadField';",
    )
featured_pattern = re.compile(
    r'''\s*<label className="block text-sm font-bold mb-2">الصورة البارزة \(رابط\)</label>\s*<input\s+type="text"\s+value=\{editingPage\.parsed\?\.featuredImage \|\| ''\}\s+onChange=\{e => setEditingPage\(\{\.\.\.editingPage, parsed: \{\.\.\.editingPage\.parsed, featuredImage: e\.target\.value\}\}\)\}\s+className="w-full border p-2 rounded text-left mb-2" dir="ltr"\s*/>\s*\{editingPage\.parsed\?\.featuredImage && \(\s*<img[^>]+/>\s*\)\}''',
    re.S,
)
pages, count = featured_pattern.subn(
    '''\n              <ImageUploadField\n                label="الصورة البارزة"\n                value={editingPage.parsed?.featuredImage || ''}\n                folder="pages/featured"\n                onChange={(url) => setEditingPage({ ...editingPage, parsed: { ...editingPage.parsed, featuredImage: url } })}\n              />''',
    pages,
    count=1,
)
if count != 1:
    raise RuntimeError('Unable to replace page featured image editor')
pages_path.write_text(pages)

# Site identity: logo and favicon from device, not URL text boxes.
settings_path = Path('src/pages/dashboard/SiteSettings.tsx')
settings = settings_path.read_text()
if "./ImageUploadField" not in settings:
    settings = settings.replace(
        "import { useContent } from '../../contexts/ContentContext';",
        "import { useContent } from '../../contexts/ContentContext';\nimport ImageUploadField from './ImageUploadField';",
    )
settings = replace_once(
    settings,
    '''          <Field label="الشعار الرئيسي" value={settings.logoUrl} onChange={(value) => handleChange('logoUrl', value)} dir="ltr" />''',
    '''          <ImageUploadField label="الشعار الرئيسي" value={settings.logoUrl} folder="site/branding" onChange={(value) => handleChange('logoUrl', value)} />''',
    'site logo',
)
settings = replace_once(
    settings,
    '''          <Field label="Favicon" value={settings.faviconUrl} onChange={(value) => handleChange('faviconUrl', value)} dir="ltr" />''',
    '''          <ImageUploadField label="Favicon" value={settings.faviconUrl} folder="site/branding" onChange={(value) => handleChange('faviconUrl', value)} helpText="يفضل صورة مربعة PNG أو WEBP." />''',
    'site favicon',
)
settings_path.write_text(settings)

# Content schemas already use ArrayEditor device upload. Remove misleading URL wording.
content_path = Path('src/pages/dashboard/ContentManager.tsx')
content = content_path.read_text()
for old, new in {
    'رابط الصورة': 'الصورة',
    'شعار الشريك (رابط الصورة)': 'شعار الشريك',
    'رابط صورة العميل': 'صورة العميل',
}.items():
    content = content.replace(old, new)
content_path.write_text(content)

# Remove the temporary codemod/workflow from the generated commit.
Path('.github/workflows/dashboard-codemod.yml').unlink(missing_ok=True)
Path('scripts/dashboard_full_crud_codemod.py').unlink(missing_ok=True)
