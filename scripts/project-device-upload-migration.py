from pathlib import Path

p = Path('src/pages/dashboard/PortfolioManager.tsx')
s = p.read_text()

if "import ImageUploadField from './ImageUploadField';" not in s:
    s = s.replace("import { useContent } from '../../contexts/ContentContext';", "import { useContent } from '../../contexts/ContentContext';\nimport ImageUploadField from './ImageUploadField';\nimport MultiImageUploadField from './MultiImageUploadField';")

old_cover = '''          <div>\n            <label className="block text-sm font-medium mb-1">صورة الغلاف (Cover Image URL)</label>\n            <input\n              type="text"\n              value={currentProject.coverImage || ''}\n              onChange={e => setCurrentProject({ ...currentProject, coverImage: e.target.value })}\n              className="w-full border p-2 rounded"\n              dir="ltr"\n            />\n          </div>'''
new_cover = '''          <ImageUploadField\n            label="صورة الغلاف"\n            value={currentProject.coverImage || ''}\n            folder="portfolio/covers"\n            onChange={(url) => setCurrentProject({ ...currentProject, coverImage: url })}\n          />'''

old_gallery = '''          <div>\n            <label className="block text-sm font-medium mb-1">معرض الصور (رابط لكل سطر)</label>\n            <textarea\n              value={currentProject.galleryImages?.join('\\n') || ''}\n              onChange={e => setCurrentProject({ ...currentProject, galleryImages: e.target.value.split('\\n').filter(Boolean) })}\n              className="w-full border p-2 rounded h-32"\n              dir="ltr"\n            />\n          </div>'''
new_gallery = '''          <MultiImageUploadField\n            label="معرض صور المشروع"\n            values={currentProject.galleryImages || []}\n            folder="portfolio/gallery"\n            onChange={(galleryImages) => setCurrentProject({ ...currentProject, galleryImages })}\n          />'''

old_before_after = '''          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">\n             <div>\n              <label className="block text-sm font-medium mb-1">صورة قبل (Before Image URL)</label>\n              <input\n                type="text"\n                value={currentProject.beforeImage || ''}\n                onChange={e => setCurrentProject({ ...currentProject, beforeImage: e.target.value })}\n                className="w-full border p-2 rounded"\n                dir="ltr"\n              />\n            </div>\n            <div>\n              <label className="block text-sm font-medium mb-1">صورة بعد (After Image URL)</label>\n              <input\n                type="text"\n                value={currentProject.afterImage || ''}\n                onChange={e => setCurrentProject({ ...currentProject, afterImage: e.target.value })}\n                className="w-full border p-2 rounded"\n                dir="ltr"\n              />\n            </div>\n          </div>'''
new_before_after = '''          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">\n            <ImageUploadField\n              label="صورة قبل التنفيذ"\n              value={currentProject.beforeImage || ''}\n              folder="portfolio/before"\n              onChange={(url) => setCurrentProject({ ...currentProject, beforeImage: url })}\n            />\n            <ImageUploadField\n              label="صورة بعد التنفيذ"\n              value={currentProject.afterImage || ''}\n              folder="portfolio/after"\n              onChange={(url) => setCurrentProject({ ...currentProject, afterImage: url })}\n            />\n          </div>'''

for old, new, name in [(old_cover,new_cover,'cover'),(old_gallery,new_gallery,'gallery'),(old_before_after,new_before_after,'before/after')]:
    if old not in s:
        raise SystemExit(f'Expected {name} block not found; aborting without changes')
    s = s.replace(old,new,1)

p.write_text(s)
