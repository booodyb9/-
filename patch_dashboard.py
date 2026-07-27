import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Replace auth methods import
content = content.replace(
    "const { user, loading, signInWithGoogle, logout, token, isAdmin } = useAuth();",
    "const { user, loading, signInWithEmail, signUpWithEmail, logout, token, isAdmin } = useAuth();\n  const [email, setEmail] = useState('');\n  const [password, setPassword] = useState('');\n  const [authError, setAuthError] = useState('');\n  const [isSignUp, setIsSignUp] = useState(false);\n\n  const handleAuth = async (e: React.FormEvent) => {\n    e.preventDefault();\n    setAuthError('');\n    const result = isSignUp \n      ? await signUpWithEmail(email, password)\n      : await signInWithEmail(email, password);\n    \n    if (result.error) {\n      setAuthError(result.error.message || 'حدث خطأ في المصادقة');\n    }\n  };\n"
)

form_html = """
            <form onSubmit={handleAuth} className="space-y-4">
              <p className="text-gray-600 mb-8">الرجاء تسجيل الدخول للوصول إلى لوحة التحكم</p>
              {authError && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{authError}</div>}
              <div>
                <input 
                  type="email" 
                  placeholder="البريد الإلكتروني" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] text-right"
                  required
                />
              </div>
              <div>
                <input 
                  type="password" 
                  placeholder="كلمة المرور" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] text-right"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-[#0284C7] text-white py-3 px-4 rounded-md hover:bg-[#0369A1] transition-colors font-bold mt-4"
              >
                {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
              </button>
              <div className="mt-4 text-sm text-gray-600">
                {isSignUp ? 'لديك حساب بالفعل؟ ' : 'ليس لديك حساب؟ '}
                <button 
                  type="button" 
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-[#0284C7] font-bold hover:underline"
                >
                  {isSignUp ? 'تسجيل الدخول' : 'إنشاء حساب'}
                </button>
              </div>
            </form>
"""

old_ui = """            <>
              <p className="text-gray-600 mb-8">الرجاء تسجيل الدخول للوصول إلى لوحة التحكم</p>
              <button 
                onClick={signInWithGoogle}
                className="w-full bg-[#0284C7] text-white py-3 px-4 rounded-md hover:bg-[#0369A1] transition-colors font-bold"
              >
                تسجيل الدخول باستخدام حساب Google
              </button>
            </>"""

content = content.replace(old_ui, form_html.strip())

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
