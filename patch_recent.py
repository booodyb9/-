with open('src/components/RecentProjects.tsx', 'r') as f:
    content = f.read()
content = content.replace("export default function RecentProjects({ limit = 6 }: { limit?: number }) {", "export default function RecentProjects({ limit = 6 }: { limit?: number, key?: React.Key }) {")
with open('src/components/RecentProjects.tsx', 'w') as f:
    f.write(content)
