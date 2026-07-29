import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Access Control', () => {
  test('should redirect unauthenticated users from /admin/dashboard to /admin/login', async ({ page }) => {
    // Attempt to visit dashboard directly
    await page.goto('/admin/dashboard');

    // Should be redirected to login page
    await expect(page).toHaveURL(/.*\/admin\/login/);

    // Verify login page renders correctly
    const loginHeader = page.locator('h1', { hasText: 'Accès Sécurisé' });
    await expect(loginHeader).toBeVisible();

    // Verify inputs exist
    const usernameInput = page.locator('input[type="text"]');
    const passwordInput = page.locator('input[type="password"]');
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('should show error for unauthorized email', async ({ page }) => {
    await page.goto('/admin/login');

    // Fill with an unauthorized email
    await page.fill('input[type="text"]', 'hacker');
    await page.fill('input[type="password"]', 'wrongpassword123');
    
    // Submit form
    await page.click('button[type="submit"]');

    // Verify the whitelist error message is displayed
    const errorMessage = page.locator('text=Identifiant ou mot de passe incorrect.');
    await expect(errorMessage).toBeVisible();
  });
});
