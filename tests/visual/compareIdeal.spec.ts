import { test, expect } from '@playwright/test';
import { pages } from '../pages';
import { getBaseUrl } from '../config/environments';

// Increase timeout for this whole describe block (e.g. 90s per test)
test.describe.configure({ timeout: 90_000 });

test.describe('Pixel-Perfect Comparison against Ideal Baselines', () => {
  const baseUrl = getBaseUrl();



  for (const pageDef of pages) {
    test(`Compare ${pageDef.name} vs Ideal`, async ({ page }) => {
      // Optional: further extend just this test if needed
      // test.setTimeout(120_000);

      // 1. Setup (match baseline width; height can be normal now)
      await page.setViewportSize({ width: 1920, height: 8000 });

      const fullUrl = `${baseUrl}${pageDef.path}`;
      console.log(`Navigating to: ${fullUrl}`);

      // Use networkidle to match baseline generation strategy
      await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 60_000 });

      // 2. Wait for Critical Element (HEALTH CHECK)
      if (pageDef.criticalElement) {
        try {
          await page.waitForSelector(pageDef.criticalElement, {
            state: 'visible',
            timeout: 20_000,
          });
          console.log(`✅ Health Check Passed: Critical element '${pageDef.criticalElement}' found.`);
        } catch (e) {
          console.error(`❌ Health Check Failed: Critical element '${pageDef.criticalElement}' NOT found.`);
          throw e; // Fail the test immediately
        }
      }

      // 3. Same pre-snapshot logic as baseline generation
      if (pageDef.beforeSnapshot) {
        await pageDef.beforeSnapshot(page);
      }

      // 4. Stabilization (Match baseline generation wait exactly)
      await page.waitForTimeout(2000);

      // 5. Visual comparison against ideal_screenshots/<fileName>.png
      const fileName = `${pageDef.name.replace(/\s+/g, '_').toLowerCase()}.png`;
      console.log(`Comparing against: ${fileName}`);

      const screenshot = await page.screenshot({
        fullPage: true,
        animations: 'disabled',
        mask: pageDef.maskedElements?.map(selector => page.locator(selector)) || [],
        maskColor: '#FF00FF',
      });

      expect(screenshot).toMatchSnapshot(fileName, {
        maxDiffPixels: 300,
        threshold: 0.3,
      });
    });
  }
});
