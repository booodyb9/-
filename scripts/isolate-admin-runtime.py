from pathlib import Path

# main.tsx: don't install admin fetch interception on public pages.
p = Path('src/main.tsx')
s = p.read_text()
s = s.replace("import { installAdminApiAuth } from './lib/installAdminApiAuth';\n", '')
s = s.replace('installAdminApiAuth();\n', '')
p.write_text(s)

# Dashboard: install admin API auth only when dashboard chunk is loaded and fetch media only for admins.
p = Path('src/pages/Dashboard.tsx')
s = p.read_text()
if "import { installAdminApiAuth } from '../lib/installAdminApiAuth';" not in s:
    s = s.replace("import { supabase } from '../lib/supabase';", "import { supabase } from '../lib/supabase';\nimport { installAdminApiAuth } from '../lib/installAdminApiAuth';")
marker = "  const [isBackingUp, setIsBackingUp] = useState(false);\n"
if "installAdminApiAuth();" not in s:
    s = s.replace(marker, marker + "\n  useEffect(() => {\n    installAdminApiAuth();\n  }, []);\n")
old = """  useEffect(() => {\n    if (!user || !isAdmin) return;\n\n    void fetchMessages();\n    const messagesChannel = supabase"""
new = """  useEffect(() => {\n    if (!user || !isAdmin) return;\n\n    void fetchMessages();\n    void fetchMedia();\n    const messagesChannel = supabase"""
if old not in s:
    raise SystemExit('Dashboard admin effect marker not found')
s = s.replace(old, new, 1)
s = s.replace("  }, [user, isAdmin, fetchMessages]);", "  }, [user, isAdmin, fetchMessages, fetchMedia]);", 1)
p.write_text(s)

# ContentContext: public pages load contents only. Media is loaded explicitly by Dashboard.
p = Path('src/contexts/ContentContext.tsx')
s = p.read_text()
s = s.replace("import { Content } from '../pages/dashboard/types';", "import type { Content } from '../pages/dashboard/types';")
old_effect = """  useEffect(() => {\n    void forceRefresh();\n\n    const contentsChannel = supabase\n      .channel('contents_changes_ctx')\n      .on('postgres_changes', { event: '*', schema: 'public', table: 'contents' }, () => {\n        void fetchContents();\n      })\n      .subscribe();\n\n    const mediaChannel = supabase\n      .channel('media_changes_ctx')\n      .on('postgres_changes', { event: '*', schema: 'public', table: 'media' }, () => {\n        void fetchMedia();\n      })\n      .subscribe();\n\n    return () => {\n      void supabase.removeChannel(contentsChannel);\n      void supabase.removeChannel(mediaChannel);\n    };\n  }, [fetchContents, fetchMedia, forceRefresh]);"""
new_effect = """  useEffect(() => {\n    void fetchContents();\n\n    const contentsChannel = supabase\n      .channel('contents_changes_ctx')\n      .on('postgres_changes', { event: '*', schema: 'public', table: 'contents' }, () => {\n        void fetchContents();\n      })\n      .subscribe();\n\n    return () => {\n      void supabase.removeChannel(contentsChannel);\n    };\n  }, [fetchContents]);"""
if old_effect not in s:
    raise SystemExit('ContentContext effect block not found')
s = s.replace(old_effect, new_effect, 1)
p.write_text(s)
