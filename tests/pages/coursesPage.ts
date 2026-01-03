import { Page, expect } from '@playwright/test';
import { PageDefinition } from '../config/testConfig';
import { getBaseUrl } from '../config/environments';

export class CoursesPage {
    readonly page: Page;
    readonly path = '/courses';

    // Locators
    // Locators
    // Using robust text/attribute locators instead of unstable hashes
    readonly coursesTab = '#tle-navbar :text-is("Courses")';
    readonly heroSection = 'h1:has-text("Our Flagship Courses")'; // Fallback to Title as anchor
    readonly heroTitle = 'h1:has-text("Our Flagship Courses")';
    readonly heroSubtitle = 'p:has-text("Our training is divided into")';
    // Card container identified by unique image alt text common to all cards
    readonly courseCard = 'div:has(img[alt^="TLE Level"])';

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        const baseUrl = getBaseUrl();
        await this.page.goto(`${baseUrl}${this.path}`);
        await this.page.waitForLoadState('networkidle');
    }

    async assertCoursesTabIsActive() {
        const tab = this.page.locator(this.coursesTab).filter({ hasText: 'Courses' });
        await expect(tab).toHaveCSS('color', 'rgb(0, 82, 195)');
    }

    async assertHeroTitle() {
        await expect(this.page.locator(this.heroTitle)).toContainText('Our Flagship Courses');
    }

    async assertHeroSubtitle() {
        await expect(this.page.locator(this.heroSubtitle)).toContainText('Our training is divided into 4 Levels');
    }

    async getAllCourseCards() {
        return this.page.locator(this.courseCard);
    }

    async assertAtLeastOneCourseCardVisible() {
        const cards = await this.getAllCourseCards();
        await expect(cards.first()).toBeVisible();

        // Optional: Log count or check count > 0 more explicitly if needed, but first().toBeVisible() implies existence.
        const count = await cards.count();
        expect(count).toBeGreaterThan(0);
    }

    // Visual Testing Config Helper
    getVisualSections() {
        return [
            { name: 'Navbar', selector: '#tle-navbar', ExpectedColor: undefined }, // Navbar ID is constant across site
            { name: 'Hero Section', selector: this.heroSection },
            { name: 'First Course Card', selector: `${this.courseCard} >> nth=0` }
        ];
    }
}

/**
 * Adapter for the Centralized Page Definition
 * Defines the contract for the visual runner while using the Class structure.
 */
export const coursesPageDef: PageDefinition = {
    name: 'Courses Page',
    path: '/courses',
    criticalElement: 'h1:has-text("Our Flagship Courses")', // Robust check for page load

    visuals: [
        { name: 'Navbar', selector: '#tle-navbar' },
        // Visual check for Hero Section now targets the semantic Title element 
        // to avoid unstable container classes
        { name: 'Hero Section', selector: 'h1:has-text("Our Flagship Courses")' },
        { name: 'First Course Card', selector: 'div:has(img[alt^="TLE Level"]) >> nth=0' },
        {
            name: 'Active Courses Tab',
            selector: '#tle-navbar :text-is("Courses")',
            ExpectedColor: 'rgb(0, 82, 195)'
        }
    ],

    maskedElements: [],

    // Scroll to bottom to ensure all course cards are loaded/rendered
    beforeSnapshot: async (page: import('@playwright/test').Page) => {
        await page.evaluate(async () => {
            window.scrollTo(0, document.body.scrollHeight);
        });
        // Short wait for any lazy load animations
        await page.waitForTimeout(500);
        // Scroll back to top for standard screenshot alignment if needed, 
        // OR leave it if fullPage handles it. FullPage usually handles it, but 
        // sometimes lazy loaded elements need to have been in viewport once.
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(500);
    },

    screenshotConfig: {
        fullPage: true,
        maxDiffPixelRatio: 0.02
    }
};
