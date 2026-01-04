import { PageDefinition } from '../config/testConfig';
import { VisualHelper } from '../utils/visualHelper';

const commonBeforeSnapshot = async (page: any) => {
    await VisualHelper.scrollFullPage(page);
};

export const faqsPage: PageDefinition = {
    name: 'FAQs Page',
    path: '/faqs',
    criticalElement: '#tle-navbar', // Fallback for stability
    maskedElements: [],
    beforeSnapshot: commonBeforeSnapshot,
    screenshotConfig: { fullPage: true }
};

export const termsPage: PageDefinition = {
    name: 'Terms Page',
    path: '/terms-and-conditions',
    criticalElement: '#tle-navbar', // Fallback
    maskedElements: [],
    beforeSnapshot: commonBeforeSnapshot,
    screenshotConfig: { fullPage: true }
};

export const privacyPage: PageDefinition = {
    name: 'Privacy Page',
    path: '/privacy-policy',
    criticalElement: '#tle-navbar',
    maskedElements: [],
    beforeSnapshot: commonBeforeSnapshot,
    screenshotConfig: { fullPage: true }
};

export const mentorsPage: PageDefinition = {
    name: 'Mentors Page',
    path: '/our-mentors',
    criticalElement: '#tle-navbar', // Fallback for stability
    maskedElements: [],
    beforeSnapshot: commonBeforeSnapshot,
    screenshotConfig: { fullPage: true }
};

export const contactPage: PageDefinition = {
    name: 'Contact Page',
    path: '/contact-us',
    criticalElement: '#tle-navbar', // Fallback for stability
    maskedElements: [],
    beforeSnapshot: commonBeforeSnapshot,
    screenshotConfig: { fullPage: true }
};
