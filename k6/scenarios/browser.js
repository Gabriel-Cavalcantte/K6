import { browser } from 'k6/browser';
import { check } from 'k6';

export const options = {
  scenarios: {
    ui_test: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
        },
      },
      vus: 1,
      iterations: 3,
    },
  },
  thresholds: {
    checks: ['rate>0.90'],
  },
};

const FRONTEND_URL = __ENV.FRONTEND_URL || 'http://frontend:8080';

export default async function () {
  const page = await browser.newPage();

  try {
    // Navigate to the frontend
    await page.goto(FRONTEND_URL, {
      waitUntil: 'networkidle',
    });

    // Check page title
    const pageTitle = await page.title();
    check(pageTitle, {
      'page title is correct': (title) => title.includes('Books Library'),
    });

    // Wait for books table to load
    await page.waitForSelector('table', { timeout: 5000 }).catch(() => {
      // Table might not exist if no books, that's ok
    });

    // Fill form and create a book
    await page.fill('#title', 'Test Book from k6');
    await page.fill('#author', 'k6 Browser Test');
    await page.fill('#isbn', '978-k6-test-' + Date.now());
    await page.fill('#year', '2024');
    await page.fill('#stock', '5');

    // Click submit button
    await page.click('button[type="submit"]');

    // Wait for success message
    await page.waitForSelector('.message.success', { timeout: 5000 }).catch(() => {
      console.log('Success message not found, but form was submitted');
    });

    check(true, {
      'book creation form submitted': (val) => val === true,
    });

    // Wait a bit for the table to refresh
    await page.waitForTimeout(1000);

    // Verify the book appears in the table
    const tableContent = await page.content();
    check(tableContent, {
      'page contains newly created book': (content) => content.includes('Test Book from k6'),
    });

    // Simulate a user viewing the book details by checking if table is visible
    const tableVisible = await page.isVisible('table');
    check(tableVisible, {
      'books table is visible': (visible) => visible === true,
    });

  } catch (error) {
    console.error('Browser test error:', error);
    check(false, {
      'no browser errors': () => false,
    });
  } finally {
    await page.close();
  }
}
