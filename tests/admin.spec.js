import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Access Control', () => {
  test('should display 401 unauthorized page and allow navigating to login', async ({ page }) => {
    // Attempt to visit dashboard directly without authentication
    await page.goto('/admin/dashboard');

    // Should display the 401 error page
    const unauthorizedTitle = page.locator('h1', { hasText: /Accès Non Autorisé|Unauthorized/i });
    await expect(unauthorizedTitle).toBeVisible();

    // Click on CTA to go to login
    await page.click('button:has-text("Se connecter"), button:has-text("Log In")');

    // Should arrive on login page
    await expect(page).toHaveURL(/.*\/admin\/login/);

    // Verify login page renders correctly
    const loginHeader = page.locator('h1', { hasText: 'Accès Sécurisé' });
    await expect(loginHeader).toBeVisible();
  });

  test('should show error for unauthorized email', async ({ page }) => {
    await page.goto('/admin/login');

    // Fill with an unauthorized email
    await page.fill('input[type="text"]', 'hacker@gmail.com');
    await page.fill('input[type="password"]', 'wrongpassword123');
    
    // Submit form
    await page.click('button[type="submit"]');

    // Verify error message is displayed
    const errorMessage = page.locator('text=Email ou mot de passe incorrect.');
    await expect(errorMessage).toBeVisible();
  });

  test('Option 2: should successfully log in with authorized email and password M@slih031984', async ({ page }) => {
    await page.goto('/admin/login');

    // Fill with authorized credentials
    await page.fill('input[type="text"]', 'moslihayoub@gmail.com');
    await page.fill('input[type="password"]', 'M@slih031984');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);

    // Verify dashboard renders welcome message
    const welcomeHeader = page.locator('h1', { hasText: /Bienvenue, Ayoub/i });
    await expect(welcomeHeader).toBeVisible();
  });

  test('Option 1: Google Sign-in button should be visible and clickable', async ({ page }) => {
    await page.goto('/admin/login');

    const googleBtn = page.locator('button', { hasText: /Continuer avec Google/i });
    await expect(googleBtn).toBeVisible();
    await expect(googleBtn).toBeEnabled();
  });
});
