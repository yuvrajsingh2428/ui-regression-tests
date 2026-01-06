import { PageDefinition } from '../config/testConfig';
import { VisualHelper } from '../utils/visualHelper';

export const contestTrackerPage: PageDefinition = {
    name: 'Contest Tracker',
    path: '/contest-tracker',

    // Use the specific "Contest Tracker" text div as the critical element
    criticalElement: 'div:has-text("Contest Tracker")',

    maskedElements: [
        // Mask live timers or dynamic dates in calendar/list view
        '.countdown-timer',
        'time',
        // Mask the Google Calendar button if it has dynamic text/dates
        '#contest-calendar-add-to-google-calendar-section'
    ],

    visuals: [
        { name: 'Navbar', selector: '#tle-navbar' },
        { name: 'Main Heading', selector: 'div:has-text("Contest Tracker")' },
        { name: 'Sub Heading', selector: 'div:has-text("By TLE Eliminators")' },
        { name: 'Description', selector: 'div:has-text("This is a one stop solution")' },
        { name: 'Action Buttons', selector: 'div:has(button:has-text("Add to Calendar"))' },
        { name: 'Video Placeholder', selector: '.ytp-cued-thumbnail-overlay-image' },
        { name: 'Platform Filter Label', selector: 'label:has-text("Contest Platforms + Divisions")' },
        { name: 'View Switcher', selector: '#contest-calendar-list-tab-view-switcher-section' }
    ],

    beforeSnapshot: async (page) => {
        await VisualHelper.scrollFullPage(page);
    },

    screenshotConfig: {
        fullPage: true
    }
};
