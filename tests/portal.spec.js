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

  test('Portal Dashboard: Topbar, Sidebar collapse, Hero card with Consultant & Firm info, Table of Weekly Reports with ID', async ({ page }) => {
    await page.goto('/portal', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('text=Ayoub MOSLIH', { timeout: 15000 });

    // 1. Topbar: Bank-e logo and user name / username (No "Avatar - Profile")
    await expect(page.locator('header img[alt*="Bank-e"]')).toBeVisible();
    await expect(page.locator('header', { hasText: 'collab.cam' })).toBeVisible();
    await expect(page.locator('text=Avatar - Profile')).toHaveCount(0);

    // 2. Sidebar Collapse Toggle
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

    // 4. Hero Card: Consultant (Ayoub MOSLIH) & Consulting Firm (Devoteam) & Contact Pills
    await expect(page.locator('text=Espace Collaborateur & Suivi Mission')).toHaveCount(0);
    await expect(page.locator('text=Karim Tazi • CAM (Crédit Agricole du Maroc)')).toHaveCount(0);
    await expect(page.locator('text=Ayoub MOSLIH').first()).toBeVisible();
    await expect(page.locator('text=Devoteam Consulting').first()).toBeVisible();
    await expect(page.locator('a:has-text("WhatsApp")').first()).toBeVisible();
    await expect(page.locator('a:has-text("Email")').first()).toBeVisible();

    // 5. Dashboard KPIs: Jours Imputés (Mois) with progress bar & Projets de Mission
    await expect(page.locator('text=Jours Imputés (Mois)')).toBeVisible();
    await expect(page.locator('text=Projets de Mission').first()).toBeVisible();
    await expect(page.locator('text=Statut Visa CRA (Mois Précédents)')).toBeVisible();

    // 6. Weekly Reports Table (Comptes Rendus Hebdo with ID)
    await expect(page.locator('text=Comptes Rendus Hebdo')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('text=CR-04').first()).toBeVisible();
    await expect(page.locator('text=Semaine 4').first()).toBeVisible();
  });

  test('Portal Reports: compact shortcuts, hidden participants, Partager & Exporter dropdowns, isolated Observations section', async ({ page }) => {
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

    // 3. Observations section isolated at the bottom
    await expect(page.locator('text=Observations & Retours Métier sur la Séance')).toBeVisible();
    await expect(page.locator('button[title*="Rehausser avec l\'IA"]')).toBeVisible();
  });

  test('Portal Projects: Dual View (Table & Kanban), 1-word tags [OCTROI], [DESIGN], [IA]', async ({ page }) => {
    await page.goto('/portal/projects', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('h1:has-text("Projets")', { timeout: 15000 });

    // 1. View Switcher
    const tableViewBtn = page.locator('button:has-text("Vue Tableau")');
    const kanbanViewBtn = page.locator('button:has-text("Vue Kanban (Jira)")');
    await expect(tableViewBtn).toBeVisible();
    await expect(kanbanViewBtn).toBeVisible();

    // 2. 1-word tags in table view
    await expect(page.locator('text=[OCTROI]').first()).toBeVisible();
    await expect(page.locator('text=[DESIGN]').first()).toBeVisible();

    // 3. Switch to Kanban View
    await kanbanViewBtn.click();
    await expect(page.locator('text=À faire').first()).toBeVisible();
    await expect(page.locator('text=En cours').first()).toBeVisible();
    await expect(page.locator('text=Terminé / Livré').first()).toBeVisible();
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
