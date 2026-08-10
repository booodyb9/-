const { JSDOM } = require('jsdom');
const http = require('http');

http.get('http://localhost:3000/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const dom = new JSDOM(data, {
      runScripts: "dangerously",
      resources: "usable",
      url: "http://localhost:3000/"
    });
    
    dom.window.addEventListener('error', (event) => {
      console.error("PAGE ERROR:", event.error ? event.error.message : event.message);
    });
    
    setTimeout(() => {
      console.log("PAGE TEXT:", dom.window.document.body.innerHTML.slice(0, 50));
      process.exit(0);
    }, 4000);
  });
});
