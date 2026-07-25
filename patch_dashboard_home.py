import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "{activeTab === 'home' && <DashboardHome />}",
    "{activeTab === 'home' && <DashboardHome messages={messages} contents={contents} mediaFiles={mediaFiles} />}"
)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
