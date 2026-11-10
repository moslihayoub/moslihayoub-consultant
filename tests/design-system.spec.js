import { test, expect } from '@playwright/test';

test.describe('Design System M84 Showcase in Admin', () => {
  test('should display Design System M84 showcase with all tabs and components', async ({ page }) => {
    // 1. Authenticate to admin
    await page.goto('/admin/login');
    await page.fill('input[type="text"]', 'moslihayoub@gmail.com');
    await page.fill('input[type="password"]', 'M@slih031984');
    await page.click('button[type="submit"]');

    // 2. Wait for admin dashboard
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);
    await expect(page.locator('text=M84 Backoffice')).toBeVisible({ timeout: 15000 });

    // 3. Click Design System M84 tab
    const dsButton = page.locator('button:has-text("Design System M84")');
    await expect(dsButton).toBeVisible();
    await dsButton.click();

    // 4. Verify Design System header & badges
    await expect(page.locator('h1:has-text("Design System M84")')).toBeVisible();
    await expect(page.locator('text=shadcn-inspired')).toBeVisible();

    // 5. Verify UI Components tab is active and showcases components
    await expect(page.locator('text=1. Boutons (`Button`)')).toBeVisible();
    await expect(page.locator('button:has-text("Bouton Principal")')).toBeVisible();
    await expect(page.locator('text=2. Badges & Statuts (`Badge`)')).toBeVisible();
    await expect(page.locator('text=3. Cartes de Métriques (`StatCard`)')).toBeVisible();

    // 6. Switch to Tokens tab
    await page.click('button:has-text("Tokens & Couleurs")');
    await expect(page.locator('text=Palette de Couleurs M84')).toBeVisible();
    await expect(page.locator('text=Vert M84 Primary')).toBeVisible();

    // 7. Switch to Animations tab
    await page.click('button:has-text("Animations & Effets")');
    await expect(page.locator('text=Presets Framer Motion')).toBeVisible();
    await expect(page.locator('text=fadeIn')).toBeVisible();
    await expect(page.locator('text=slideUp')).toBeVisible();
  });
});
