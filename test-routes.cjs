const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const routes = ['/', '/about', '/services', '/portfolio', '/blog', '/faq', '/contact'];
  
  for (const route of routes) {
    console.log("TESTING:", route);
    let hasError = false;
    page.on('pageerror', err => {
      console.log('PAGE ERROR on ' + route + ':', err.toString());
      hasError = true;
    });
    await page.goto('http://localhost:3000' + route);
    await page.waitForTimeout(1000);
    const text = await page.evaluate(() => document.body.innerText.substring(0, 100));
    if (text.length < 10) console.log("WARNING: Empty body on " + route);
  }
  
  await browser.close();
  console.log("All routes verified.");
})();
