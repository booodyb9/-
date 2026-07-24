import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
  };
}

export interface Session {
  access_token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Mock local session
    const storedAuth = localStorage.getItem('mock_auth');
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        setSession(parsed.session);
        setUser(parsed.user);
        setIsAdmin(true); // default to admin for mock
      } catch (e) {
        console.error("Failed to parse mock auth", e);
      }
    }
    setLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    try {
      const mockUser = {
        id: 'mock_user_id',
        email: 'admin@example.com',
        user_metadata: {
          full_name: 'Admin User',
        }
      };
      const mockSession = {
        access_token: 'mock_token',
        user: mockUser
      };
      localStorage.setItem('mock_auth', JSON.stringify({ session: mockSession, user: mockUser }));
      setUser(mockUser);
      setSession(mockSession);
      setIsAdmin(true);
    } catch (error) {
      console.error("Error signing in", error);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('mock_auth');
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      loading, 
      signInWithGoogle, 
      logout, 
      token: session?.access_token || null, 
      isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
