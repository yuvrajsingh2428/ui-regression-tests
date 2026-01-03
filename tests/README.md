# Visual Regression & Page Health Framework

## Overview
This framework uses Playwright to perform automated visual regression testing (Scuba testing) across the application. It is designed to be scalable, maintaining one file per page definition.

## Directory Structure
- `config/`: Centralized environment and test configuration.
- `pages/`: Page definitions (URL, selectors, masking rules).
- `utils/`: Helpers for logging and visual logic.
- `visual/`: Actual test specs.

## How It Works
1. **Runner**: `pageHealth.visual.spec.ts` imports the list of pages from `pages/index.ts`.
2. **Execution**: It iterates over each page, navigates to the environment URL, waits for critical elements, masks dynamic content, and compares with the baseline.

## Operating Instructions

### 1. How Baselines are Created
On the first run, Playwright will not find existing screenshots and will fail the test, suggesting to create them. 
To generate initial baselines (or update them):
```bash
npx playwright test --update-snapshots
```
This command captures the current state of pages and saves them as the "truth".

### 2. Where Screenshots are Stored
Screenshots are stored in the `tests/visual` directory (or wherever your `playwright.config.ts` points 'snapshotDir' to, usually adjacent to the spec file by default, inside a `-snapshots` folder).
Structure:
```
visual/
  pageHealth.visual.spec.ts-snapshots/
    home_page-chromium-win32.png
    courses_page-chromium-win32.png
```
You MUST commit these files to Git to serve as the baseline for CI.

### 3. How to Add New Pages
1. Create a new file in `tests/pages/`, e.g., `aboutPage.ts`.
2. Define the page object implementing `PageDefinition`:
   ```typescript
   export const aboutPage: PageDefinition = {
       name: 'About Page',
       path: '/about',
       criticalElement: 'h1.about-title',
       maskedElements: [],
   };
   ```
3. Export it in `tests/pages/index.ts`:
   ```typescript
   import { aboutPage } from './aboutPage';
   export const pages = [ ..., aboutPage ];
   ```
4. Run `npx playwright test --update-snapshots` to generate the new baseline.

### 4. Running Tests
```bash
# Default (Staging)
npx playwright test

# Specific Environment
set TEST_ENV=prod
npx playwright test
```

## CI/CD Pipeline (GitHub Actions)

This repository is equipped with a GitHub Action (`ui-scuba.yml`) that runs on every Push and Pull Request.

### Workflow
1. **Install**: Sets up Node.js and installs dependencies.
2. **Browsers**: Installs required Playwright browsers (Chromium, Firefox, WebKit).
3. **Execute**: Runs `npx playwright test` against Staging.
4. **Artifacts**:
   - **Playwright Report**: Always uploaded. shows full HTML report.
   - **Test Results**: Uploaded on *failure*. Contains the diff images.

### Debugging CI Failures
If the CI job `📸 Visual Regression` fails:
1. Go to the **Actions** tab in GitHub.
2. Click on the failed run.
3. Scroll down to **Artifacts** and download `playwright-report` or `test-results`.
4. Open the report to see the **Actual** vs **Expected** vs **Diff** view.
5. If the change is intentional:
   - Run `npx playwright test --update-snapshots` locally.
   - Commit the updated images.
   - Push the changes.
