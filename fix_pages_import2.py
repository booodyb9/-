import re

with open('src/pages/dashboard/PagesManager.tsx', 'r') as f:
    content = f.read()

content = content.replace("const { supabase } = await Promise.resolve().then(() => require('../../lib/supabase'));", "")

with open('src/pages/dashboard/PagesManager.tsx', 'w') as f:
    f.write(content)
