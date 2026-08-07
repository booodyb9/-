const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if(msg.type() === 'error') console.log('PAGE ERROR LOG:', msg.text());
  });
  page.on('pageerror', err => console.log('PAGE ERROR STACK:', err.stack || err.toString()));
  
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(2000);
  const text = await page.evaluate(() => document.body.innerText.substring(0, 50));
  console.log("TEXT:", text.replace(/\n/g, ' '));
  await browser.close();
})();
