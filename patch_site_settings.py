import re

with open('src/pages/dashboard/SiteSettings.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { saveContent } from '../../lib/supabase';", "import { saveContent } from '../../lib/supabase';\nimport { useContent } from '../../contexts/ContentContext';")
content = content.replace("export default function SiteSettings({ contents, fetchContents }: Props) {", "export default function SiteSettings({ contents, fetchContents }: Props) {\n  const { updateContent } = useContent();")
content = content.replace("await saveContent('site_settings', 'Site Settings', 'json', JSON.stringify(settings));", "await saveContent('site_settings', 'Site Settings', 'json', JSON.stringify(settings));\n      updateContent('site_settings', JSON.stringify(settings));")

with open('src/pages/dashboard/SiteSettings.tsx', 'w') as f:
    f.write(content)
