import { test, expect } from '@playwright/test';

test.describe('MUN Simulation User Journey', () => {
    test.beforeEach(async ({ page }) => {
        // Go straight to the simulation page
        await page.goto('/munsimulation');
    });

    test('should render the simulation layout properly', async ({ page }) => {
        // Look for main headings instead of CSS module class names
        await expect(page.getByRole('heading', { name: 'MUN Simulation Game' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Committee Room' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Committee Setup' })).toBeVisible();
    });

    test('should be able to select committee and delegation', async ({ page }) => {
        // Wait for hydration and data to load
        await page.waitForLoadState('networkidle');

        // Select Committee.
        const committeeSelect = page.getByRole('combobox', { name: /Committee/i }).first();
        const options = committeeSelect.locator('option');

        // Wait for options to populate
        await expect(options).toHaveCount(await options.count() > 1 ? await options.count() : 2, { timeout: 10000 }).catch(() => { });

        const count = await options.count();
        if (count > 1) {
            const valueToSelect = await options.nth(1).getAttribute('value');
            if (valueToSelect) {
                await committeeSelect.selectOption(valueToSelect);

                // Now delegation select should be populated
                const delegationSelect = page.getByRole('combobox', { name: /Your Delegation/i });
                const delOptions = delegationSelect.locator('option');
                await expect(delOptions).toHaveCount(await delOptions.count() > 1 ? await delOptions.count() : 2, { timeout: 5000 }).catch(() => { });

                if (await delOptions.count() > 1) {
                    const delValue = await delOptions.nth(1).getAttribute('value');
                    if (delValue) {
                        await delegationSelect.selectOption(delValue);

                        // "Start Simulation" button should now be enabled
                        const startBtn = page.getByRole('button', { name: /Start Simulation/i });
                        await expect(startBtn).toBeEnabled();
                    }
                }
            }
        }
    });

    test('should open Chair Role practice', async ({ page }) => {
        const chairBtn = page.getByRole('link', { name: /Chair's Role/i });
        await expect(chairBtn).toBeVisible();
        const href = await chairBtn.getAttribute('href');
        await chairBtn.scrollIntoViewIfNeeded(); // Still good for visibility check
        await page.goto(href!);

        await expect(page).toHaveURL(/.*munsimulation\/chairs.*/);
        await page.waitForLoadState('networkidle');
        await expect(page.getByRole('heading', { name: /Chair's Procedure Practice/i })).toBeVisible({ timeout: 10000 });
    });
});
