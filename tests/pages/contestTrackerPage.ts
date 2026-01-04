import { PageDefinition } from '../config/testConfig';
import { VisualHelper } from '../utils/visualHelper';

export const contestTrackerPage: PageDefinition = {
    name: 'Contest Tracker',
    path: '/contest-tracker',

    criticalElement: '#tle-navbar',

    maskedElements: [
        // Live timers or dynamic dates often appear on tracker pages
        '.countdown-timer',
        'time'
    ],

    visuals: [
        { name: 'Navbar', selector: '#tle-navbar' },
        { name: 'Tracker Header', selector: 'div:has(h1:has-text("Contest Tracker"))' }
    ],

    beforeSnapshot: async (page) => {
        await VisualHelper.scrollFullPage(page);
    },

    screenshotConfig: {
        fullPage: true
    }
};
