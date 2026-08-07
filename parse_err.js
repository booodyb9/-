import fs from 'fs';
const logs = fs.readFileSync('test_err.js', 'utf8');
console.log(logs);
