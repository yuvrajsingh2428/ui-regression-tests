import { defineConfig, devices } from '@playwright/test';

/**
 * Dedicated Configuration for Ideal Baseline Comparisons
 * 
 * Usage: npx playwright test tests/visual/compareIdeal.spec.ts --config playwright.ideal.config.ts
 */
export default defineConfig({
    testDir: './tests',
    timeout: 90 * 1000,
    expect: {
        timeout: 10000,
        // Provide a higher default tolerance for visual regression if needed
        toHaveScreenshot: {
            maxDiffPixelRatio: 0.02
        }
    },

    // CRITICAL: Point snapshots to the root 'ideal_screenshots' folder
    snapshotPathTemplate: '{testFileDir}/../../ideal_screenshots/{arg}',

    fullyParallel: true,
    reporter: 'list',
    use: {
        trace: 'on-first-retry',
        viewport: { width: 1920, height: 1080 },
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
