content = open('src/contexts/AuthContext.tsx').read()
content = content.replace("import { createContext, useContext, useEffect, useState, ReactNode } from 'react';", "import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';")
content = content.replace("""  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      loading, 
      signInWithEmail, 
      signUpWithEmail, 
      logout, 
      token: session?.access_token || null, 
      isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );""", """  const value = useMemo(() => ({
      user, 
      session,
      loading, 
      signInWithEmail, 
      signUpWithEmail, 
      logout, 
      token: session?.access_token || null, 
      isAdmin 
    }), [user, session, loading, isAdmin]);
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );""")
open('src/contexts/AuthContext.tsx', 'w').write(content)
