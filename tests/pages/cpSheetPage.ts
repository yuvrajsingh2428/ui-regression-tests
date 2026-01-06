import { PageDefinition } from '../config/testConfig';
import { VisualHelper } from '../utils/visualHelper';

export const cpSheetPage: PageDefinition = {
    name: 'CP-31 Sheet',
    path: '/cp-sheet',

    // Waiting for the main heading is usually the safest health check
    // Use the specific "CP-31 Sheet" text div as the critical element
    criticalElement: 'div:has-text("CP-31 Sheet")',

    maskedElements: [
        // Mask dynamic progress steps (e.g., "0/31", "5/372" Problems Solved)
        'div:has-text("Rating Progress") + div',
        'div:has-text("Overall Progress") + div'
    ],

    visuals: [
        { name: 'Navbar', selector: '#tle-navbar' },
        { name: 'Main Heading', selector: 'div:has-text("CP-31 Sheet")' },
        { name: 'Sub Heading', selector: 'div:has-text("Hand-picked Problems")' },
        { name: 'Description', selector: 'div:has-text("This sheet is curated by")' },
        { name: 'Action Buttons', selector: 'div:has(button:has-text("Explore Courses"))' },
        // Use a broader selector for the video placeholder if the class is dynamic/minified
        { name: 'Video Placeholder', selector: '.ytp-cued-thumbnail-overlay-image' },
        { name: 'Rating Tabs', selector: 'div:has(div:has-text("Rating"))' },
        { name: 'Progress Section', selector: 'div:has-text("Rating Progress")' },
        { name: 'Leaderboard Header', selector: 'div:has-text("Leaderboard")' }
    ],

    beforeSnapshot: async (page) => {
        await VisualHelper.scrollFullPage(page);
    },

    screenshotConfig: {
        fullPage: true
    }
};
