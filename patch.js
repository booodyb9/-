const fs = require('fs');
const file = 'src/pages/dashboard/HomepageBuilder.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/const stored = localStorage.getItem\('mock_contents'\);[\s\S]*?localStorage.setItem\('mock_contents', JSON.stringify\(currentContents\)\);/g, 
`await saveContent('homepage_sections', 'ترتيب الصفحة الرئيسية', 'array', JSON.stringify(sections));`);
fs.writeFileSync(file, content);
