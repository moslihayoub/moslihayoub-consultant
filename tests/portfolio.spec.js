import { test, expect } from '@playwright/test';

test.describe('Portfolio E2E Tests', () => {
  test('Should navigate to protected project The Factory', async ({ page }) => {
    // 1. Go to homepage
    await page.goto('http://localhost:5173/');
    
    // 2. Click on 'Work' in the navbar
    await page.getByRole('link', { name: /Work|Réalisations/i }).first().click();
    
    // 3. Verify we are on the Work page
    await expect(page).toHaveURL(/.*\/work/);
    
    // 4. Click the 'AI Filmmaking' filter tab
    await page.getByRole('button', { name: 'AI Filmmaking' }).click();
    
    // 5. Click on the project 'The Factory'
    // Wait for the animation to finish
    await page.waitForTimeout(1000);
    await page.getByText('The Factory').first().click();
    
    // 6. Verify modal opens and enter password
    const passwordInput = page.locator('input#access-code');
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill('031984');
    
    // 7. Click submit (the button with type submit inside the modal)
    await page.locator('form button[type="submit"]').click();
    
    // 8. Verify redirect to /project/the-factory
    await expect(page).toHaveURL(/.*\/project\/the-factory/);
    
    // 9. Verify the title "The Factory" exists on the page
    const title = page.locator('h1', { hasText: 'The Factory' });
    await expect(title).toBeVisible();
    
    // 10. Verify videos are present and native (not iframes)
    const videos = page.locator('video');
    const videoCount = await videos.count();
    expect(videoCount).toBeGreaterThan(0);
    
    // 11. Scroll down to trigger ScrollSpy
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(1000);
    
    await expect(page.getByText('Pré-production').last()).toBeVisible();
    
    console.log('✅ End to End test completed successfully!');
  });
});
