import { PageDefinition } from '../config/testConfig';
import { VisualHelper } from '../utils/visualHelper';

export const cpSheetPage: PageDefinition = {
    name: 'CP-31 Sheet',
    path: '/cp-sheet',

    // Waiting for the main heading is usually the safest health check
    criticalElement: '#tle-navbar', // Fallback for stability

    maskedElements: [
        // Mask potential dynamic dates or progress if any
    ],

    visuals: [
        { name: 'Navbar', selector: '#tle-navbar' },
        { name: 'Sheet Header', selector: 'div:has(h1:has-text("CP-31 Sheet"))' }
    ],

    beforeSnapshot: async (page) => {
        await VisualHelper.scrollFullPage(page);
    },

    screenshotConfig: {
        fullPage: true
    }
};
