import re

with open('src/contexts/AuthContext.tsx', 'r') as f:
    content = f.read()

new_useEffect = """
  useEffect(() => {
    let mounted = true;

    const checkAdmin = async (userId: string | undefined) => {
      if (!userId) {
        if (mounted) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admins')
          .select('id')
          .eq('id', userId)
          .single();

        if (mounted) {
          setIsAdmin(!!data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        if (mounted) {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    };

    const initializeAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await checkAdmin(session.user.id);
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // If login happens or state changes, we might briefly be loading again
          // but let's just do a check without showing a loading spinner to avoid flashing
          // Actually, we probably should show a loader or just check silently
          setLoading(true);
          await checkAdmin(session.user.id);
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);
"""

content = re.sub(r'  useEffect\(\(\) => \{.*return \(\) => subscription\.unsubscribe\(\);\n  \}, \[\]\);', new_useEffect.strip(), content, flags=re.DOTALL)

with open('src/contexts/AuthContext.tsx', 'w') as f:
    f.write(content)
