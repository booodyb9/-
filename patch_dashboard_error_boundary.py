import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

if "import ErrorBoundary" not in content:
    content = content.replace("import DashboardLayout", "import ErrorBoundary from '../components/ErrorBoundary';\nimport DashboardLayout")

    # Wrap each tab with ErrorBoundary
    content = re.sub(
        r'\{activeTab === \'([a-z_]+)\' && <([A-Za-z]+)(.*?)\/>\}',
        r"{activeTab === '\1' && <ErrorBoundary><\2\3/></ErrorBoundary>}",
        content
    )
    # also match multi-line or those that pass children
    # Actually just replacing `<Component ... />` with `<ErrorBoundary><Component ... /></ErrorBoundary>`
    
    with open('src/pages/Dashboard.tsx', 'w') as f:
        f.write(content)
    print("Dashboard.tsx patched")
else:
    print("Already patched")
