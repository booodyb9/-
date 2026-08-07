from pathlib import Path

FILES = [
    'patch_navbar2.py', 'patch_sections.py', 'patch_css.py', 'patch_blog.py',
    'patch_html.py', 'patch_server.py', 'patch_services.py', 'patch_cm_success.py',
    'patch_blog_details.py', 'patch_array_editor.py', 'patch_services_page.py',
    'patch_service_details.py', 'patch_portfolio_success.py',
    'patch_array_editor_delete.py', 'patch_dashboard_error_boundary.py',
    'bun.lock'
]
for name in FILES:
    p = Path(name)
    if p.exists():
        p.unlink()
        print('removed', name)
