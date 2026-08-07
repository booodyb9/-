content = open('src/contexts/LanguageContext.tsx').read()
content = content.replace("import React, { createContext, useContext, useState, useEffect } from 'react';", "import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';")
content = content.replace("""  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );""", """  const value = useMemo(() => ({ language, toggleLanguage }), [language]);
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );""")
open('src/contexts/LanguageContext.tsx', 'w').write(content)
