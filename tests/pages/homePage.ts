import { PageDefinition } from '../config/testConfig';

/**
 * Home Page Definition
 * 
 * Defines the contract for the Home Page visual test.
 */
export const homePage: PageDefinition = {
    name: 'Home Page',
    path: '/',

    // Critical visual component for this page (Navbar)
    criticalElement: '#tle-navbar',

    // Visual Sections to Capture specifically
    visuals: [
        {
            name: 'Navbar',
            selector: '#tle-navbar'
        },
        {
            name: 'Hero Banner',
            // Captures the banner below the navbar (CP Digest)
            // Strategy: Use semantic section or positional locator if class is dynamic
            // But usually a specific text locator is best for unique content
            selector: 'div:has-text("Self-Paced CP Courses")'
        },
        {
            name: 'activeNav',
            selector: '#tle-navbar :text-is("Home")',
            ExpectedColor: 'rgb(0, 82, 195)',
        },
        {
            name: 'Main Hero',
            // Main introduction section
            // Strategy: Find the container with the unique title
            selector: 'div:has-text("Competitive Coding Simplified")'
        }
    ],

    // Elements to mask (dynamic content)
    maskedElements: [
        // Buttons with hover effects often cause flakiness unless disabled or masked
        // We mask specific spans or dynamic decorators if they animate
        'button > span.hover-effect',

        // Any rotating text or carousels not part of the core visual check
        '.animated-element'
    ],

    screenshotConfig: {
        fullPage: true,
        maxDiffPixelRatio: 0.02
    },

    // Scroll to bottom incrementally to ensure all lazy loaded elements are rendered
    beforeSnapshot: async (page: import('@playwright/test').Page) => {
        await page.evaluate(async () => {
            const distance = 100;
            const delay = 100;
            const timer = setInterval(() => {
                const scroller = document.scrollingElement || document.body;
                scroller.scrollBy(0, distance);
                if (scroller.scrollTop + window.innerHeight >= scroller.scrollHeight) {
                    clearInterval(timer);
                }
            }, delay);
        });
        // Wait sufficient time for the scroll to reach bottom
        await page.waitForTimeout(3000);

        // Scroll back to top for standard screenshot alignment
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(500);
    }
};
