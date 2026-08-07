from pathlib import Path

FILES = [
    'patch_media.py', 'patch_media2.py', 'patch_portfolio.py', 'patch_portfolio2.py',
    'patch_pages_manager.py', 'patch_pages_seo.py', 'patch_seo_local_business.py',
    'patch_dynamic_seo.py', 'patch_cm.py', 'patch_content.py', 'patch_array.py',
    'patch_bulk_fix.py', 'patch_hero.py', 'fix_seo_order.py', 'fix_gallery_slider.py',
    'fix_projects.js', 'fix_server.py', 'check_slugs.js', 'dump_all_projects.js',
    'get-schema.js', 'insert_gallery.py', 'add_gallery_slider.py', 'add_blog.py',
    'test-jsdom.cjs', 'test-upload-auth.js', 'test-image-upload.js',
    'test-media-insert.js', 'test-media-insert2.js', 'test-media-insert3.js',
    'test-media-insert4.js', 'test-media-insert5.js'
]

for name in FILES:
    path = Path(name)
    if path.exists():
        path.unlink()
        print('removed', name)
