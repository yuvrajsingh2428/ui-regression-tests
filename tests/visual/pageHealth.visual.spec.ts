import { test } from '@playwright/test';
import { pages } from '../pages';
import { getBaseUrl } from '../config/environments';
import { VisualHelper } from '../utils/visualHelper';
import { Logger } from '../utils/logger';

/**
 * Visual Scuba / Page Health Test Runner
 * 
 * Iterates through all defined pages and performs:
 * 1. Health Check (Critical element visibility)
 * 2. Visual Regression Check (Full page snapshot comparison)
 */

test.describe('Visual Page Health & Scuba Suite', () => {
    const baseUrl = getBaseUrl();

    Logger.info('Suite Setup', `Running Visual Tests against Environment: ${baseUrl}`);

    // Iterate through centrally defined pages
    for (const pageDef of pages) {

        test(`Visual & Health Check: ${pageDef.name}`, async ({ page }) => {
            const fullUrl = `${baseUrl}${pageDef.path}`;

            // 1. Navigation
            Logger.step(`Navigating to ${fullUrl}`);
            await page.goto(fullUrl, { waitUntil: 'networkidle' });

            // 2. Validate Visuals (includes Health Check)
            await VisualHelper.validatePageVisuals(page, pageDef);
        });
    }
});


