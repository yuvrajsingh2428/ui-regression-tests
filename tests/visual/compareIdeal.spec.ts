import { test, expect } from '@playwright/test';
import { pages } from '../pages';
import { getBaseUrl } from '../config/environments';

/**
 * Script to Compare Current State against Ideal Baselines
 * 
 * Run with: npx playwright test tests/visual/compareIdeal.spec.ts
 * 
 * Logic:
 * 1. Configure snapshot directory to be 'ideal_screenshots' in the root.
 * 2. Navigate to pages.
 * 3. Scroll/Stabilize.
 * 4. Compare full page screenshot with the stored ideal version.
 */
test.describe('Pixel-Perfect Comparison against Ideal Baselines', () => {
    const baseUrl = getBaseUrl();

    // Configure Playwright to look for snapshots in the root 'ideal_screenshots' folder
    // {testFileDir} is tests/visual/. We need to go up two levels to root.
    test.use({
        snapshotPathTemplate: '{testFileDir}/../../ideal_screenshots/{arg}'
    });

    for (const pageDef of pages) {
        test(`Compare ${pageDef.name} vs Ideal`, async ({ page }) => {

            // 1. Setup
            await page.setViewportSize({ width: 1920, height: 1080 });

            const fullUrl = `${baseUrl}${pageDef.path}`;
            console.log(`Navigating to: ${fullUrl}`);
            await page.goto(fullUrl);
            await page.waitForLoadState('networkidle');

            // 2. Wait for Critical Element
            if (pageDef.criticalElement) {
                await page.waitForSelector(pageDef.criticalElement, { state: 'visible' });
            }

            // 3. Scroll Logic (Must match the generation script exactly)
            if (pageDef.beforeSnapshot) {
                await pageDef.beforeSnapshot(page);
            }

            // 4. Stabilization
            await page.waitForTimeout(3000); // 3s explicitly to match generation script

            // 5. Comparison
            const fileName = `${pageDef.name.replace(/\s+/g, '_').toLowerCase()}.png`;

            // Note: maxDiffPixels option is not natively available in all Playwright versions in toHaveScreenshot config without custom extenders,
            // but standard options are maxDiffPixels (in recent versions) or threshold.
            // If the user's TS version complains, we'll need to remove it, but recent Playwright supports it.
            await expect(page).toHaveScreenshot(fileName, {
                fullPage: true,
                animations: 'disabled',
                mask: pageDef.maskedElements?.map(selector => page.locator(selector)) || [],
                maskColor: '#FF00FF',
                maxDiffPixels: 100, // Tolerance for minor rendering noise
                threshold: 0.2
            });
        });
    }
});
