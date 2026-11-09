import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('public/devtools-screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const PAGES_TO_TEST = [
  { name: 'Portfolio Home', url: 'http://localhost:5173/' },
  { name: 'M84 Ops Portal', url: 'http://localhost:5173/portal' },
  { name: 'M84 Ops Login', url: 'http://localhost:5173/portal/login' },
  { name: 'Admin Login', url: 'http://localhost:5173/admin/login' },
];

const VIEWPORTS = [
  { name: 'Desktop (1440px)', width: 1440, height: 900, isMobile: false },
  { name: 'Mobile (375px iPhone X)', width: 375, height: 812, isMobile: true },
];

async function runDevToolsAudit() {
  console.log('🚀 Démarrage de l\'audit DevTools & Smoke Test Navigateur...\n');

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];

  for (const targetPage of PAGES_TO_TEST) {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        isMobile: vp.isMobile,
        hasTouch: vp.isMobile,
        deviceScaleFactor: 2,
      });

      const page = await context.newPage();
      const consoleErrors = [];
      const consoleWarnings = [];
      const failedRequests = [];

      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
        if (msg.type() === 'warning') consoleWarnings.push(msg.text());
      });

      page.on('pageerror', err => {
        consoleErrors.push(`[Uncaught] ${err.message}`);
      });

      page.on('requestfailed', req => {
        // Ignore aborted requests caused by fast navigation or cancelled analytics
        if (req.failure()?.errorText !== 'net::ERR_ABORTED') {
          failedRequests.push(`${req.method()} ${req.url()} (${req.failure()?.errorText || 'Failed'})`);
        }
      });

      const startTime = Date.now();
      let status = 'SUCCESS';
      let errorMsg = null;

      try {
        const response = await page.goto(targetPage.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        const loadDuration = Date.now() - startTime;
        const httpStatus = response?.status() || 0;

        // Ensure rendering is stabilized
        await page.waitForTimeout(1500);

        // Capture screenshot
        const slug = `${targetPage.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}_${vp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        const screenshotPath = path.join(SCREENSHOT_DIR, `${slug}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false });

        results.push({
          page: targetPage.name,
          url: targetPage.url,
          viewport: vp.name,
          httpStatus,
          loadDuration: `${loadDuration}ms`,
          consoleErrors,
          consoleWarnings,
          failedRequests,
          screenshot: `${slug}.png`,
          status: consoleErrors.length === 0 ? 'PASSED' : 'HAS_CONSOLE_ERRORS',
        });
      } catch (err) {
        results.push({
          page: targetPage.name,
          url: targetPage.url,
          viewport: vp.name,
          httpStatus: 'TIMEOUT_OR_CRASH',
          loadDuration: `${Date.now() - startTime}ms`,
          consoleErrors: [...consoleErrors, err.message],
          consoleWarnings,
          failedRequests,
          screenshot: null,
          status: 'FAILED',
        });
      } finally {
        await context.close();
      }
    }
  }

  await browser.close();

  console.log('------------------------------------------------------------');
  console.log('📊 RÉSULTAT DEVTOOLS / CONSOLE & RÉSEAU :');
  console.log('------------------------------------------------------------');
  results.forEach(r => {
    const icon = r.status === 'PASSED' ? '✅' : '❌';
    console.log(`${icon} [${r.viewport}] ${r.page} -> HTTP ${r.httpStatus} (${r.loadDuration}) | Erreurs Console: ${r.consoleErrors.length} | Échecs Réseau: ${r.failedRequests.length}`);
    if (r.consoleErrors.length > 0) {
      console.log('   ⚠️ Erreurs Console :', r.consoleErrors);
    }
    if (r.failedRequests.length > 0) {
      console.log('   ⚠️ Requêtes Réseau :', r.failedRequests);
    }
  });

  console.log('\n📸 Captures d\'écran générées dans :', SCREENSHOT_DIR);
}

runDevToolsAudit().catch(err => {
  console.error('Erreur audit DevTools:', err);
  process.exit(1);
});
