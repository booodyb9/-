import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("import DriveBackup from './dashboard/DriveBackup';", "import DriveBackup from './dashboard/DriveBackup';\nimport PerformanceTool from './dashboard/PerformanceTool';")

# Add the new tab mapping
content = content.replace("{activeTab === 'settings' && <ErrorBoundary><SiteSettings contents={contents} fetchContents={fetchContents} /></ErrorBoundary>}", "{activeTab === 'settings' && <ErrorBoundary><SiteSettings contents={contents} fetchContents={fetchContents} /></ErrorBoundary>}\n      {activeTab === 'performance' && <ErrorBoundary><PerformanceTool /></ErrorBoundary>}")

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
