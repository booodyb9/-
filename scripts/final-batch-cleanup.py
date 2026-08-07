from pathlib import Path
import re

root = Path('.')

# Remove only legacy one-off maintenance/diagnostic scripts from the repository root.
patterns = [
    'patch_*.py', 'fix_*.py', 'generate_*.py',
    'check*.js', 'dump*.js', 'query*.js', 'get-*.js', 'get_*.js', 'fix-*.js', 'fix_*.js',
]
for pattern in patterns:
    for path in root.glob(pattern):
        if path.is_file():
            path.unlink()
            print('removed', path)

bun_lock = root / 'bun.lock'
if bun_lock.exists():
    bun_lock.unlink()
    print('removed bun.lock')

# Clarify dashboard labels: image fields use device upload controls, not URL text fields.
p = Path('src/pages/dashboard/ContentManager.tsx')
s = p.read_text()
replacements = {
    "label: 'رابط الصورة'": "label: 'الصورة — رفع من الجهاز'",
    "label: 'شعار الشريك (رابط الصورة)'": "label: 'شعار الشريك — رفع من الجهاز'",
    "label: 'رابط صورة العميل'": "label: 'صورة العميل — رفع من الجهاز'",
}
for old, new in replacements.items():
    s = s.replace(old, new)
p.write_text(s)
