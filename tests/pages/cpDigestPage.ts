import { PageDefinition } from '../config/testConfig';
import { VisualHelper } from '../utils/visualHelper';

export const cpDigestPage: PageDefinition = {
    name: 'CP Digest',
    path: '/cp-digest',

    // Fallback to navbar if specific h1 isn't strictly "CP Digest" (e.g. might be "Latest Articles")
    // But usually there is a main title.
    criticalElement: '#tle-navbar',

    maskedElements: [
        'span.date', // Article dates
        'div.views'  // View counts
    ],

    visuals: [
        { name: 'Navbar', selector: '#tle-navbar' }
    ],

    beforeSnapshot: async (page) => {
        await VisualHelper.scrollFullPage(page);
    },

    screenshotConfig: {
        fullPage: true
    }
};
