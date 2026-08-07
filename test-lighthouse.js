import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';

async function run() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  // Start server first in background, wait for it
  
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['seo', 'accessibility', 'best-practices'],
    port: (new URL(browser.wsEndpoint())).port
  };
  
  const runnerResult = await lighthouse('http://localhost:3000', options);

  console.log('SEO score:', runnerResult.lhr.categories.seo.score * 100);
  console.log('Accessibility score:', runnerResult.lhr.categories.accessibility.score * 100);
  console.log('Best Practices score:', runnerResult.lhr.categories['best-practices'].score * 100);

  await browser.close();
}

run();
