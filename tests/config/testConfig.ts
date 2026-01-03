import { PlaywrightTestConfig } from '@playwright/test';

/**
 * Global Configuration for Visual Regression Tests
 */

// Define the contract for a Page Definition
export interface PageDefinition {
    /** Friendly name of the page for logging and reporting */
    name: string;

    /** Relative path from the base URL (e.g., '/home', '/courses') */
    path: string;

    /** 
     * Selector for a critical element that MUST be visible 
     * before we consider the page 'loaded' and ready for a screenshot.
     */
    criticalElement: string;

    /**
     * Array of selectors to mask (cover with pink/magenta box)
     * during screenshot capture. Use this for dynamic content 
     * (carousels, timestamps, user-specific data).
     */
    maskedElements: string[];

    /**
     * Optional list of specific visual sections to capture independently.
     * Useful for large pages where you want to isolate components (e.g. Hero, Navbar).
     */
    visuals?: {
        name: string;
        selector: string;
        ExpectedColor?: string;
    }[];

    /** Optional screenshot specific override configuration */
    screenshotConfig?: {
        fullPage?: boolean;
        maxDiffPixelRatio?: number;
        threshold?: number;
    };

    /**
     * Optional callback to run before taking any screenshots.
     * Useful for scrolling to lazy-load elements or setting up specific UI states.
     */
    beforeSnapshot?: (page: import('@playwright/test').Page) => Promise<void>;
}

// Global visual configuration defaults
export const visualConfig = {
    // Default acceptable pixel difference ratio
    maxDiffPixelRatio: 0.02,

    // Default threshold for individual pixels
    threshold: 0.2,

    // Wait time before taking screenshot (stabilization)
    snapshotDelay: 1000,
};

// Timeout configurations
export const testTimeouts = {
    navigation: 30000,
    assertion: 10000,
};
