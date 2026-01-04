import { homePage } from './homePage';
import { coursesPageDef } from './coursesPage';
import { cpSheetPage } from './cpSheetPage';
import { contestTrackerPage } from './contestTrackerPage';
import { cpDigestPage } from './cpDigestPage';
import { faqsPage, termsPage, privacyPage, mentorsPage, contactPage } from './staticPages';
import { PageDefinition } from '../config/testConfig';

// Central Registry of all pages to be visually tested
export const pages: PageDefinition[] = [
    homePage,
    coursesPageDef,
    cpSheetPage,
    contestTrackerPage,
    cpDigestPage,
    faqsPage,
    termsPage,
    privacyPage,
    mentorsPage,
    contactPage
    // Add new pages here...
];
