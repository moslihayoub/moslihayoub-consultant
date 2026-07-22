import { test, expect } from '@playwright/test';

test.describe('Portfolio E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigates to the app before each test
    await page.goto('/');
  });

  test('should load the homepage and display the hero section', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Ayoub MOSLIH/);
    
    // Check if the hero section is visible
    const heroTitle = page.locator('h1').first();
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText('Catalyser');
  });

  test('navigation links should work', async ({ page }) => {
    // Click on Work link
    await page.getByRole('link', { name: 'Projets' }).click();
    // Ensure URL has changed to /work
    await expect(page).toHaveURL(/.*\/work/);
    
    // Check that Work page loaded
    const workTitle = page.locator('h1').first();
    await expect(workTitle).toContainText('Selected Work');
    
    // Click on About link
    await page.getByRole('link', { name: 'À propos' }).click();
    await expect(page).toHaveURL(/.*\/about/);
  });

  test('project modal should open when clicking a project card', async ({ page }) => {
    // Navigate to Work page
    await page.goto('/work');
    
    // Click the first project card
    const firstProject = page.locator('.project-card').first();
    // Find the Autocash Sourcing MVP project card and click it
    const projectCard = page.locator('h3', { hasText: 'Autocash Sourcing MVP' }).first();
    await projectCard.click();

    // Wait for the modal to appear
    const modalHeading = page.locator('h3', { hasText: 'Accès Restreint' });
    await expect(modalHeading).toBeVisible();
  });
});
