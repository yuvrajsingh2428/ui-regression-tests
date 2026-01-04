import { Page, expect } from '@playwright/test';
import { PageDefinition, visualConfig } from '../config/testConfig';
import { Logger } from './logger';

/**
 * Visual Helper
 * 
 * Centralizes the logic for capturing screenshots, handling masks,
 * and performing visual assertions.
 */
export class VisualHelper {

    /**
     * Helper to scroll the full page to trigger lazy loading
     */
    static async scrollFullPage(page: Page) {
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve(null);
                    }
                }, 100);
            });
            window.scrollTo(0, 0);
        });
    }

    /**
     * Validates page health and performs visual regression test.
     */
    static async validatePageVisuals(page: Page, pageDef: PageDefinition) {
        Logger.step(`Starting Visual Validation for: ${pageDef.name}`);

        // 1. Wait for Critical Element
        try {
            Logger.info('Health Check', `Waiting for critical element: ${pageDef.criticalElement}`);
            await page.waitForSelector(pageDef.criticalElement, { state: 'visible', timeout: 10000 });
            Logger.success('Health Check', 'Critical element visible. Page is healthy.');
        } catch (error) {
            Logger.error('Health Check', `Failed to find critical element ${pageDef.criticalElement} on ${pageDef.name}`);
            throw error;
        }

        // 2. Prepare for Screenshot (Wait for stabilization)
        if (pageDef.beforeSnapshot) {
            Logger.info('Visual', `Running beforeSnapshot hook for ${pageDef.name}`);
            await pageDef.beforeSnapshot(page);
        }
        await page.waitForTimeout(visualConfig.snapshotDelay);

        // 3. Configure Masks
        const maskLocators = pageDef.maskedElements.map(selector => page.locator(selector));

        // 4. Capture & Compare (Main Page or Defined Visuals)

        // If specific visuals are defined, capture them individually
        if (pageDef.visuals && pageDef.visuals.length > 0) {
            Logger.info('Visual', `Capturing ${pageDef.visuals.length} defined sections for ${pageDef.name}`);

            for (const visual of pageDef.visuals) {
                const sectionName = visual.name.replace(/\s+/g, '_').toLowerCase();
                const fileName = `${pageDef.name.replace(/\s+/g, '_').toLowerCase()}_${sectionName}.png`;
                const locator = page.locator(visual.selector).first();

                // Ensure the element is visible before snapshot
                await locator.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
                    Logger.error('Visual', `Visual section '${visual.name}' (${visual.selector}) not found.`);
                });

                // Check for expected color if defined
                if (visual.ExpectedColor) {
                    await expect(locator).toHaveCSS('color', visual.ExpectedColor);
                    Logger.success('Visual', `Color match: ${visual.name} has color ${visual.ExpectedColor}`);
                }

                await expect(locator).toHaveScreenshot(fileName, {
                    mask: maskLocators,
                    maskColor: '#FF00FF',
                    maxDiffPixelRatio: pageDef.screenshotConfig?.maxDiffPixelRatio ?? visualConfig.maxDiffPixelRatio,
                    threshold: pageDef.screenshotConfig?.threshold ?? visualConfig.threshold,
                    animations: 'disabled',
                });
                Logger.success('Visual', `Subsection match: ${visual.name}`);
            }
        }

        // Always capture the main page view (Full Page)
        // This ensures holistic page health beyond just components.
        Logger.info('Visual', `Capturing main screenshot for ${pageDef.name}...`);

        // Custom naming as requested by user
        let customName = pageDef.name.toLowerCase();
        if (customName === 'home page') customName = 'home full page';
        if (customName === 'courses page') customName = 'courses full page';

        const fileName = `${customName}.png`;

        // 1. Save "Ideal" screenshot to separate folder as requested
        await page.screenshot({
            path: `ideal_screenshots/${fileName}`,
            fullPage: pageDef.screenshotConfig?.fullPage ?? true,
            mask: maskLocators,
            maskColor: '#FF00FF',
            animations: 'disabled'
        });
        Logger.success('Visual', `Saved ideal screenshot to ideal_screenshots/${fileName}`);

        // 2. Perform Playwright Visual Assertion (Comparison)
        await expect(page).toHaveScreenshot(fileName, {
            fullPage: pageDef.screenshotConfig?.fullPage ?? true,
            mask: maskLocators,
            maskColor: '#FF00FF', // High contrast magenta for debugging masks
            maxDiffPixelRatio: pageDef.screenshotConfig?.maxDiffPixelRatio ?? visualConfig.maxDiffPixelRatio,
            threshold: pageDef.screenshotConfig?.threshold ?? visualConfig.threshold,
            animations: 'disabled', // Ensure consistent snapshots
        });

        Logger.success('Visual', `Screenshot match successful for ${pageDef.name}`);
    }
}
