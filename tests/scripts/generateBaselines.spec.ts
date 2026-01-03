import { test } from '@playwright/test';
import { pages } from '../pages';
import { getBaseUrl } from '../config/environments';
import path from 'path';
import fs from 'fs';

/**
 * Script to Generate Ideal "Golden" Baselines
 *
 * Run with:
 *   npx playwright test tests/scripts/generateBaselines.spec.ts --headed
 */
test.describe('Generate Ideal Baselines', () => {
  const baseUrl = getBaseUrl();
  const idealDir = path.resolve(process.cwd(), 'ideal_screenshots');

  test.beforeAll(async () => {
    if (!fs.existsSync(idealDir)) {
      fs.mkdirSync(idealDir, { recursive: true });
    }
  });

  for (const pageDef of pages) {
    test(`Generate Baseline for ${pageDef.name}`, async ({ page }) => {
      console.log(`Generating baseline for: ${pageDef.name}`);

      // 1. Use a very tall fixed viewport to cover full content height
      //    (no scrolling logic; let Playwright render a tall page once)
      await page.setViewportSize({ width: 1920, height: 8000 });

      // 2. Navigate
      const fullUrl = `${baseUrl}${pageDef.path}`;
      console.log(`Navigating to: ${fullUrl}`);
      await page.goto(fullUrl, { waitUntil: 'networkidle' });

      // 3. Wait for critical element
      if (pageDef.criticalElement) {
        await page.waitForSelector(pageDef.criticalElement, { state: 'visible' });
      }

      // 4. Custom setup (close banners, login, etc.)
      if (pageDef.beforeSnapshot) {
        console.log(`Running beforeSnapshot for ${pageDef.name}...`);
        await pageDef.beforeSnapshot(page);
      }

      // 5. Small stabilization wait
      await page.waitForTimeout(2000);

      // 6. Take full page screenshot (document will be up to 8000px tall)
      const fileName = `${pageDef.name.replace(/\s+/g, '_').toLowerCase()}.png`;
      const outputPath = path.resolve(idealDir, fileName);

      await page.screenshot({
        path: outputPath,
        fullPage: true,
        animations: 'disabled',
        mask: pageDef.maskedElements?.map((selector: string) => page.locator(selector)) || [],
        maskColor: '#FF00FF',
      });

      console.log(`Saved baseline to: ${outputPath}`);
    });
  }
});
