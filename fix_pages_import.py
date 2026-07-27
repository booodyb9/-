import re

with open('src/pages/dashboard/PagesManager.tsx', 'r') as f:
    content = f.read()

content = content.replace("const { supabase } = await import('../../lib/supabase');", "const { supabase } = await Promise.resolve().then(() => require('../../lib/supabase'));")
# Wait, actually since it's already imported at the top, I can just use it directly!

with open('src/pages/dashboard/PagesManager.tsx', 'w') as f:
    f.write(content.replace("const { supabase } = await import('../../lib/supabase');", ""))
