import re

with open('src/pages/dashboard/PagesManager.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import { saveContent } from '../../lib/supabase';",
    "import { saveContent } from '../../lib/supabase';\nimport { useContent } from '../../contexts/ContentContext';"
)

content = content.replace(
    "export default function PagesManager({ pages, fetchContents }: Props) {",
    "export default function PagesManager({ pages, fetchContents }: Props) {\n  const { updateContent } = useContent();"
)

content = content.replace(
    "await saveContent(editingPage.key, editingPage.title, 'page', editingPage.body);",
    "await saveContent(editingPage.key, editingPage.title, 'page', editingPage.body);\n      updateContent(editingPage.key, editingPage.body);"
)

with open('src/pages/dashboard/PagesManager.tsx', 'w') as f:
    f.write(content)
