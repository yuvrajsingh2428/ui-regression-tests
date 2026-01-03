import { homePage } from './homePage';
import { coursesPageDef } from './coursesPage';
import { PageDefinition } from '../config/testConfig';

// Central Registry of all pages to be visually tested
export const pages: PageDefinition[] = [
    homePage,
    coursesPageDef,
    // Add new pages here...
];
