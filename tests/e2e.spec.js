import { test, expect } from '@playwright/test';

test.describe('Portfolio E2E', () => {
  test('should navigate home and check work projects', async ({ page }) => {
    // Navigate to Home
    await page.goto('/');

    // Check Home page content
    await expect(page.locator('h1').first()).toContainText('Catalyser');

    // Click "Work" in navbar
    await page.locator('nav').getByRole('link', { name: 'Projets', exact: true }).click();

    // Verify Work page URL and content
    await expect(page).toHaveURL('/work');
    await expect(page.locator('h1').first()).toContainText('Selected Work.');

    // Click on the restricted project
    await page.getByText('Autocash Sourcing MVP', { exact: true }).click();

    // Check if modal appears
    const modalTitle = page.getByRole('heading', { name: 'Accès Restreint' });
    await expect(modalTitle).toBeVisible();

    // Close the modal
    await page.locator('button').locator('.lucide-x').locator('..').first().click();
    
    // Ensure modal is closed
    await expect(modalTitle).not.toBeVisible();

  });
});
