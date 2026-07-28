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
    await expect(heroTitle).toContainText(/Catalyser|Catalyzing/i);
  });

  test('navigation links should work', async ({ page }) => {
    // Click on Work link
    await page.getByRole('link', { name: /Work|Projets|Réalisations/i }).first().click();
    // Ensure URL has changed to /work
    await expect(page).toHaveURL(/.*\/work/);
    
    // Check that Work page loaded
    const workTitle = page.locator('h1').first();
    await expect(workTitle).toContainText(/Selected Work|Réalisations|Projets/i);
    
    // Click on About link
    await page.getByRole('link', { name: /À propos|About/i }).first().click();
    await expect(page).toHaveURL(/.*\/about/);
  });

  test('project modal should open when clicking a project card', async ({ page }) => {
    // Navigate to Work page
    await page.goto('/work');
    
    // Find the Autocash Sourcing MVP project card and click it
    const projectCard = page.locator('h3', { hasText: 'Autocash Sourcing MVP' }).first();
    await projectCard.click();

    // Wait for the modal to appear
    const modalHeading = page.locator('h3', { hasText: /Accès Restreint|Restricted Access/i });
    await expect(modalHeading).toBeVisible();
  });

  test('chatbot widget should open, accept user query and display response', async ({ page }) => {
    await page.goto('/');
    
    // Click on FAB button to open chat
    const fabButton = page.locator('button[aria-label*="Agent M84"], button[aria-label*="chat"]').first();
    await expect(fabButton).toBeVisible();
    await fabButton.click();
    
    // Check that chat window opened
    const botName = page.locator('h4', { hasText: /Agent M84|M84/i });
    await expect(botName).toBeVisible();
    
    // Find input and type a query
    const chatInput = page.locator('input[placeholder*="Agent M84"], input[placeholder*="question"]').first();
    await expect(chatInput).toBeVisible();
    await chatInput.fill('Quels sont tes services ?');
    
    // Submit the query
    await chatInput.press('Enter');
    
    // Check that user message appears in chat
    const userMessage = page.locator('p', { hasText: 'Quels sont tes services ?' });
    await expect(userMessage).toBeVisible();
    
    // Wait for M84 response to appear
    const modelResponse = page.locator('p', { hasText: /Transformation Digitale|services|Ayoub/i }).first();
    await expect(modelResponse).toBeVisible({ timeout: 10000 });
  });
});
