const fs = require('fs');
let code = fs.readFileSync('src/contexts/ContentContext.tsx', 'utf8');
code = code.replace(
  'const [contents, setContents] = useState<Content[]>([]);',
  `const [contents, setContents] = useState<Content[]>(() => { try { const cached = localStorage.getItem('rg_contents_cache'); return cached ? JSON.parse(cached) : []; } catch { return []; } });`
);
code = code.replace(
  'const [loading, setLoading] = useState(true);',
  `const [loading, setLoading] = useState(() => { try { return !localStorage.getItem('rg_contents_cache'); } catch { return true; } });`
);
code = code.replace(
  'setContents(data as Content[]);',
  `setContents(data as Content[]); try { localStorage.setItem('rg_contents_cache', JSON.stringify(data)); } catch (e) {}`
);
fs.writeFileSync('src/contexts/ContentContext.tsx', code);
