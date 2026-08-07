content = open('src/contexts/ContentContext.tsx').read()
content = content.replace("import { createContext, useContext, useEffect, useState, ReactNode } from 'react';", "import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';")
content = content.replace("return (\n    <ContentContext.Provider value={{ contents, loading, getContent, refreshContent: fetchContents, updateContent, mediaFiles, fetchMedia, forceRefresh }}>\n      {children}\n    </ContentContext.Provider>\n  );", """  const value = useMemo(() => ({ contents, loading, getContent, refreshContent: fetchContents, updateContent, mediaFiles, fetchMedia, forceRefresh }), [contents, loading, mediaFiles]);
  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );""")
open('src/contexts/ContentContext.tsx', 'w').write(content)
