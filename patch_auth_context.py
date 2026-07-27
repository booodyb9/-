import re

with open('src/contexts/AuthContext.tsx', 'r') as f:
    content = f.read()

content = content.replace('signInWithGoogle: () => Promise<void>;', 'signInWithEmail: (e: string, p: string) => Promise<{error: any}>;\n  signUpWithEmail: (e: string, p: string) => Promise<{error: any}>;')

auth_methods = """
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error("Error signing in", error);
      return { error };
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error("Error signing up", error);
      return { error };
    }
  };
"""

content = re.sub(r'  const signInWithGoogle = async \(\) => \{.*?  \};', auth_methods.strip(), content, flags=re.DOTALL)

content = content.replace('signInWithGoogle,', 'signInWithEmail,\n       signUpWithEmail,')

with open('src/contexts/AuthContext.tsx', 'w') as f:
    f.write(content)
