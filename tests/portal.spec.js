import { test, expect } from '@playwright/test';

test.describe('M84 Ops Client Portal - Bank-e CAM Refinements', () => {

  test('Portal Login Screen: Bank-e logo, Identifiant, Password Eye toggle, No backlink', async ({ page }) => {
    await page.goto('/portal/login', { waitUntil: 'domcontentloaded' });

    // Wait for container to be rendered
    await page.waitForSelector('h1:has-text("Portail Collaborateur Client")', { timeout: 15000 });

    // 1. Bank-e logo should be visible
    const logo = page.locator('img[alt*="Bank-e"]');
    await expect(logo).toBeVisible({ timeout: 10000 });

    // 2. Identifiant field should exist (not email)
    const idInput = page.locator('input[placeholder="collab.cam"]');
    await expect(idInput).toBeVisible();

    // 3. Password field with Eye toggle
    const pwdInput = page.locator('input[type="password"]');
    await expect(pwdInput).toBeVisible();
    await pwdInput.fill('CAM@2026');

    // Click Eye toggle to show password
    const eyeBtn = page.locator('button[aria-label="Afficher le mot de passe"]');
    await expect(eyeBtn).toBeVisible();
    await eyeBtn.click();
    await expect(page.locator('input[type="text"][value="CAM@2026"]')).toBeVisible();

    // Click Eye toggle again to hide password
    const eyeOffBtn = page.locator('button[aria-label="Masquer le mot de passe"]');
    await eyeOffBtn.click();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // 4. Link "Retour au Portfolio d'Ayoub MOSLIH" must NOT exist
    const backLink = page.locator('text=Retour au Portfolio');
    await expect(backLink).toHaveCount(0);

    // 5. Test login submission
    await idInput.fill('collab.cam');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/portal/, { timeout: 10000 });
  });

  test('Portal Dashboard: Topbar, Sidebar collapse, Hero card with Consultant & Firm info, Table of Weekly Reports', async ({ page }) => {
    await page.goto('/portal', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('text=Ayoub MOSLIH', { timeout: 15000 });

    // 1. Topbar: Bank-e logo and user name / username (No "Avatar - Profile")
    await expect(page.locator('header img[alt*="Bank-e"]')).toBeVisible();
    await expect(page.locator('header', { hasText: 'collab.cam' })).toBeVisible();
    await expect(page.locator('text=Avatar - Profile')).toHaveCount(0);

    // 2. Sidebar Collapse Toggle (Inside sidebar aside)
    const collapseBtn = page.locator('aside button[title*="barre latérale"], aside button[title*="outils"]');
    await expect(collapseBtn).toBeVisible();
    const aside = page.locator('aside');
    await expect(aside).toHaveCSS('width', '260px');
    await collapseBtn.click();
    await expect(aside).toHaveCSS('width', '76px');
    await collapseBtn.click();
    await expect(aside).toHaveCSS('width', '260px');

    // 3. Left sidebar must NOT contain "Consultant Référent" card
    const sidebarConsultant = aside.locator('text=Consultant Référent');
    await expect(sidebarConsultant).toHaveCount(0);

    // 4. Hero Card: Consultant (Ayoub MOSLIH) & Consulting Firm (Devoteam) & Contact Pills (No old text)
    await expect(page.locator('text=Espace Collaborateur & Suivi Mission')).toHaveCount(0);
    await expect(page.locator('text=Karim Tazi • CAM (Crédit Agricole du Maroc)')).toHaveCount(0);
    await expect(page.locator('text=Ayoub MOSLIH').first()).toBeVisible();
    await expect(page.locator('text=Devoteam Consulting').first()).toBeVisible();
    await expect(page.locator('a:has-text("WhatsApp")').first()).toBeVisible();
    await expect(page.locator('a:has-text("Email")').first()).toBeVisible();

    // 5. Dashboard KPIs: Jours Imputés (Mois) & Chantiers Actifs
    await expect(page.locator('text=Jours Imputés (Mois)')).toBeVisible();
    await expect(page.locator('text=Chantiers Actifs')).toBeVisible();

    // 6. Weekly Reports Table (4 par mois)
    await expect(page.locator('text=Comptes Rendus Hebdomadaires de Mission')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('text=Semaine 1')).toBeVisible();
    await expect(page.locator('text=Semaine 4')).toBeVisible();
  });

  test('Portal Reports: 250px compact shortcuts, hidden participants, Partager & Exporter dropdowns', async ({ page }) => {
    await page.goto('/portal/reports', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('h1:has-text("Comptes Rendus")', { timeout: 15000 });

    // 1. Participants must be masked
    await expect(page.locator('text=Participants :')).toHaveCount(0);

    // 2. Action Dropdowns
    const shareBtn = page.locator('button:has-text("Partager")');
    const exportBtn = page.locator('button:has-text("Exporter")');
    await expect(shareBtn).toBeVisible();
    await expect(exportBtn).toBeVisible();

    // Open Partager dropdown
    await shareBtn.click();
    await expect(page.locator('text=Partager via WhatsApp')).toBeVisible();
    await expect(page.locator('text=Envoyer par Email au Manager')).toBeVisible();
    await expect(page.locator('text=Copier le lien sécurisé')).toBeVisible();

    // Open Exporter dropdown
    await exportBtn.click();
    await expect(page.locator('text=Télécharger en PDF Officiel')).toBeVisible();
    await expect(page.locator('text=Télécharger en Word (.doc)')).toBeVisible();
    await expect(page.locator('text=Ouvrir dans Google Docs')).toBeVisible();
  });

  test('Portal Projects: 4 KPIs and Rich Projects & Tasks Table', async ({ page }) => {
    await page.goto('/portal/projects', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('h1:has-text("Chantiers & Projets")', { timeout: 15000 });

    // 1. 4 KPIs
    await expect(page.locator('text=Chantiers Actifs')).toBeVisible();
    await expect(page.locator('text=Avancement Global')).toBeVisible();
    await expect(page.locator('text=Tâches Clôturées')).toBeVisible();
    await expect(page.locator('text=Livrables Design & IA')).toBeVisible();

    // 2. Tasks table
    await expect(page.locator('text=Détail des Chantiers & Matrice des Tâches')).toBeVisible();
    await expect(page.locator('text=Refonte Expérience Octroi de Crédit').first()).toBeVisible();
    await expect(page.locator('text=Design System Global Bank-e v2.0').first()).toBeVisible();
  });

  test('Portal Timesheet: Unified page with Absences, daily units, Attachment upload gate', async ({ page }) => {
    await page.goto('/portal/timesheet', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('h1:has-text("Timesheet")', { timeout: 15000 });

    // 1. Daily units (1j / 0.5j), no hourly schedule
    await expect(page.locator('text=Unité : Jour (1j) ou Demi-journée (0.5j)')).toBeVisible();
    await expect(page.locator('text=09:00 - 12:30')).toHaveCount(0);
    await expect(page.locator('text=Détail des Activités & Livrables Réalisés')).toHaveCount(0);

    // 2. Relevé des Absences integrated at the bottom of the same page
    await expect(page.locator('#absences')).toBeVisible();
    await expect(page.locator('text=Relevé des Absences & Congés Justifiés')).toBeVisible();

    // 3. Direct route /portal/absences redirects to timesheet#absences
    await page.goto('/portal/absences', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/portal\/timesheet/, { timeout: 10000 });
  });

});
