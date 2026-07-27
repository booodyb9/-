import re

with open('src/pages/dashboard/PagesManager.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import { supabase, saveContent } from '../../lib/supabase';",
    "import { supabase, saveContent } from '../../lib/supabase';\nimport { useContent } from '../../contexts/ContentContext';"
)

with open('src/pages/dashboard/PagesManager.tsx', 'w') as f:
    f.write(content)
