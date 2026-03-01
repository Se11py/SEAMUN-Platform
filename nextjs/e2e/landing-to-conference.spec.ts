import { test, expect } from '@playwright/test';

test.describe('Landing to Conference User Journey', () => {
    test('user can browse conferences and navigate to details', async ({ page }) => {
        // 1. Navigate to landing page
        await page.goto('/');

        // 2. Verify main elements are present
        // Look for the tagline or the main tabs container
        await expect(page.locator('.sub-navbar-tagline')).toHaveText(/Track upcoming and previous Model United Nations/i);
        await expect(page.locator('#searchInput')).toBeVisible();

        // 3. Wait for conference cards to load (they are fetched dynamically)
        // We look for the "ConferenceCard" elements or similar identifying class
        const conferenceCard = page.locator('a.conference-card-link').first();
        await expect(conferenceCard).toBeVisible({ timeout: 10000 });

        // 4. Navigate to the details page
        // We do this via explicit navigation because WebKit click interception can sometimes be flaky on Nextjs links
        const linkHref = await conferenceCard.getAttribute('href');
        expect(linkHref).not.toBeNull();
        expect(linkHref).not.toBe('');

        // Wait a small amount of time for initial hydration to complete
        await page.waitForTimeout(1000);
        await page.goto(linkHref!);

        // 5. Verify navigation to the details page
        // The URL should contain "/conference/"
        await expect(page).toHaveURL(new RegExp(linkHref!));
        await page.waitForLoadState('networkidle');

        // 6. Verify details page content
        // Should have a "Back to Home" button and conference specific headers
        // Should have a "Back to Home" button and conference specific headers
        await expect(page.locator('h1.conf-detail-title')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('.back-to-home-btn')).toBeVisible();
    });

    test('user can filter conferences', async ({ page }) => {
        await page.goto('/');

        // Wait for items to load
        const conferenceCard = page.locator('.conference-card');
        await expect(conferenceCard.first()).toBeVisible({ timeout: 10000 });
        const initialCount = await conferenceCard.count();

        // Type something random to make sure the filter works and yields no results
        const searchInput = page.locator('#searchInput');
        await searchInput.fill('ZZZZZZZThisWillNotMatchAnyConference');

        // Wait for the empty state to appear
        await expect(page.getByText('No conferences found')).toBeVisible();

        // Clear the filter
        const clearBtn = page.getByRole('button', { name: 'Clear Filters' });
        await clearBtn.click({ force: true });

        // Should be back to initial view
        await expect(conferenceCard.first()).toBeVisible();
        await expect(async () => {
            const newCount = await conferenceCard.count();
            expect(newCount).toBeGreaterThan(0);
        }).toPass({ timeout: 10000 });
    });
});
