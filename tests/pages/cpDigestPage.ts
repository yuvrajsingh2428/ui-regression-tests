import { PageDefinition } from '../config/testConfig';
import { VisualHelper } from '../utils/visualHelper';

export const cpDigestPage: PageDefinition = {
    name: 'CP Digest',
    path: '/cp-digest',

    // Use the specific "Introducing CP Digest" heading as the critical element
    criticalElement: 'h1:has-text("Introducing CP Digest")',

    maskedElements: [
        // Mask date and read time (e.g. "30th November, 2025 • 7 mins read")
        'div:has-text("mins read")',
        // Mask view counts (e.g. "24197 views")
        'div:has-text("views")',
        // Mask like count if dynamic (e.g. "32")
        'span:has-text("32")', // Ideally use a more generic selector if possible, e.g. next sibling of icon
    ],

    visuals: [
        { name: 'Navbar', selector: '#tle-navbar' },
        { name: 'Main Heading', selector: 'h1:has-text("Introducing CP Digest")' },
        { name: 'Description', selector: 'p:has-text("This blog highlights")' },
        { name: 'Action Buttons', selector: 'div:has(button:has-text("Explore Courses"))' },
        { name: 'Article Metadata', selector: 'div:has(div:has-text("mins read"))' },
        { name: 'Author Section', selector: 'div:has(span:has-text("TLE Eliminators"))' },
        { name: 'Tags', selector: 'div:has(span:has-text("Competitive Programming"))' },
        { name: 'Catalog', selector: 'div:has(h2:has-text("Catalog"))' },
        { name: 'ToC', selector: 'h2:has-text("On This Page")' }
    ],

    beforeSnapshot: async (page) => {
        await VisualHelper.scrollFullPage(page);
    },

    screenshotConfig: {
        fullPage: true
    }
};
