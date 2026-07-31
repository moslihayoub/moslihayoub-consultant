# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: portfolio.spec.js >> Portfolio E2E Tests >> Should navigate to protected project The Factory
- Location: tests/portfolio.spec.js:4:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByText('The Factory').first()

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e5]:
      - link "Ayoub MOSLIH Logo Ayoub MOSLIH" [ref=e6]:
        - /url: /
        - img "Ayoub MOSLIH Logo" [ref=e7]
        - text: Ayoub MOSLIH
      - list [ref=e8]:
        - listitem [ref=e9]:
          - link "Home" [ref=e10]:
            - /url: /
            - img [ref=e11]
        - listitem [ref=e14]:
          - link "Work" [ref=e15]:
            - /url: /work
            - img [ref=e16]
        - listitem [ref=e20]:
          - link "About" [ref=e21]:
            - /url: /about
            - img [ref=e22]
        - listitem [ref=e25]:
          - button "EN - Changer de langue" [ref=e26]:
            - img [ref=e27]
            - generic [ref=e30]: EN
  - main [ref=e31]:
    - generic [ref=e33]:
      - generic [ref=e36]:
        - generic [ref=e37]:
          - generic [ref=e38]: Values
          - heading "Selected Work." [level=1] [ref=e39]
          - paragraph [ref=e40]: A collection of digital transformation, UX/UI design, and AI strategy projects.
          - generic [ref=e41]:
            - generic [ref=e42]: 10+ yrs Transformation
            - generic [ref=e43]: 7+ yrs UX/UI
            - generic [ref=e44]: 2+ yrs AI Strategy
        - generic [ref=e46]:
          - generic [ref=e51]:
            - img [ref=e52]
            - heading "Strategic UX" [level=3] [ref=e55]
          - generic [ref=e56]:
            - img [ref=e57]
            - heading "Mobile-first" [level=3] [ref=e59]
          - generic [ref=e60]:
            - img [ref=e61]
            - heading "Product strategy" [level=3] [ref=e65]
          - generic [ref=e66]:
            - img [ref=e67]
            - heading "Automation" [level=3] [ref=e70]
      - generic [ref=e73]:
        - generic [ref=e74]: Autocash
        - generic [ref=e75]: Carrefour
        - generic [ref=e76]: Foodeals
        - generic [ref=e77]: Nexastay
        - generic [ref=e78]: Babmoulay driss
        - generic [ref=e79]: JSEI
        - generic [ref=e80]: CGI
        - generic [ref=e81]: Wiggli
        - generic [ref=e82]: OCP
        - generic [ref=e83]: CDM Bank
        - generic [ref=e84]: Stibits
        - generic [ref=e85]: HBM Com.
        - generic [ref=e86]: Autocash
        - generic [ref=e87]: Carrefour
        - generic [ref=e88]: Foodeals
        - generic [ref=e89]: Nexastay
        - generic [ref=e90]: Babmoulay driss
        - generic [ref=e91]: JSEI
        - generic [ref=e92]: CGI
        - generic [ref=e93]: Wiggli
        - generic [ref=e94]: OCP
        - generic [ref=e95]: CDM Bank
        - generic [ref=e96]: Stibits
        - generic [ref=e97]: HBM Com.
      - generic [ref=e99]:
        - generic [ref=e100]:
          - generic [ref=e101]:
            - generic [ref=e102]: Portfolio
            - heading "All Projects" [level=2] [ref=e103]
            - paragraph [ref=e104]: Click to explore the technical details of each implementation.
          - generic [ref=e105]:
            - button "Tous" [ref=e106]
            - button "UX/UI" [ref=e107]
            - button "MVP Ai" [ref=e108]
            - button "Motion Graphics" [ref=e109]
            - button "AI Filmmaking" [ref=e110]
        - generic [ref=e111]:
          - generic [ref=e114]:
            - img "QuickToken UI" [ref=e116]
            - generic [ref=e117]:
              - heading "QuickToken UI" [level=3] [ref=e118]
              - paragraph [ref=e119]: Outil Interne
              - paragraph [ref=e120]: Smart JSON Design System generator to easily configure and instantly preview your UI components.
              - separator [ref=e121]
              - paragraph [ref=e122]: This innovative MVP was entirely designed and developed using Google AI Studio, showcasing the potential of LLMs in automating Design Systems.
          - generic [ref=e125]:
            - generic [ref=e126]:
              - img "Autocash Sourcing MVP" [ref=e127]
              - generic [ref=e128]:
                - img [ref=e129]
                - text: Accès restreint
            - generic [ref=e132]:
              - heading "Autocash Sourcing MVP" [level=3] [ref=e133]
              - paragraph [ref=e134]: Autocash.ma
              - paragraph [ref=e135]: SaaS sourcing solution for buying and selling used vehicles. Mobile-first approach focused on field agents.
              - separator [ref=e136]
              - paragraph [ref=e137]: UX Discovery, one-to-one interviews, and rapid LLM-assisted MVP design for idea validation leveraging the existing Autocash Design System.
          - generic [ref=e140]:
            - generic [ref=e141]:
              - img "Nexastay MVP" [ref=e142]
              - generic [ref=e143]:
                - img [ref=e144]
                - text: Accès restreint
            - generic [ref=e147]:
              - heading "Nexastay MVP" [level=3] [ref=e148]
              - paragraph [ref=e149]: Nexastay
              - paragraph [ref=e150]: AI-enhanced Proptech resembling Booking/Airbnb, designed to centralize the guest and host experience.
              - separator [ref=e151]
              - paragraph [ref=e152]: The project involved an in-depth UX Discovery phase and the creation of the complete UI on Figma.
          - generic [ref=e155]:
            - img "ParcelIQ HR AI" [ref=e157]
            - generic [ref=e158]:
              - heading "ParcelIQ HR AI" [level=3] [ref=e159]
              - paragraph [ref=e160]: ParcelIQ
              - paragraph [ref=e161]: HR SaaS platform dedicated to AI-assisted resume analysis and recruitment pipeline management.
              - separator [ref=e162]
              - paragraph [ref=e163]: The MVP was built using Google AI Studio (LLM) to validate the viability of the concept.
          - generic [ref=e166]:
            - img "Freelance Financial Calculator" [ref=e168]
            - generic [ref=e169]:
              - heading "Freelance Financial Calculator" [level=3] [ref=e170]
              - paragraph [ref=e171]: Outil Interne
              - paragraph [ref=e172]: Highly customized quotation, invoicing, and profitability calculation tool specifically designed for freelancers.
              - separator [ref=e173]
              - paragraph [ref=e174]: An MVP developed in collaboration with Google AI Studio.
          - generic [ref=e177]:
            - generic [ref=e178]:
              - img "Agence Urbaine Larache" [ref=e179]
              - generic [ref=e180]:
                - img [ref=e181]
                - text: Accès restreint
            - generic [ref=e184]:
              - heading "Agence Urbaine Larache" [level=3] [ref=e185]
              - paragraph [ref=e186]: Agence Urbaine
              - paragraph [ref=e187]: Website redesign for the Larache-Ouezzane Urban Agency to support socio-economic and territorial planning projects.
              - separator [ref=e188]
              - paragraph [ref=e189]: UX Audit, wireframing, UI iterations, and design of interactive mockups on Figma.
        - button "Load more" [ref=e191]
      - generic [ref=e193]:
        - generic [ref=e194]:
          - generic [ref=e195]: Education
          - heading "Certifications" [level=2] [ref=e196]
          - paragraph [ref=e197]: Certified training in digital strategy, design thinking, and AI.
        - generic [ref=e198]:
          - 'link "Anthropic Certificat Certification Anthropic gjht8vtzj8ve Année: 2024" [ref=e200]':
            - /url: /certif/Anthropic/certificate-gjht8vtzj8ve-1775037520.pdf
            - generic [ref=e202]:
              - img [ref=e203]
              - generic [ref=e206]: Anthropic
              - generic [ref=e207]: Certificat
            - generic [ref=e208]:
              - heading "Certification Anthropic gjht8vtzj8ve" [level=3] [ref=e209]
              - generic [ref=e210]:
                - img [ref=e211]
                - generic [ref=e214]: "Année: 2024"
          - 'link "Google Certificat Certification Google 3DLGWZ6GZOIA Année: 2024" [ref=e216]':
            - /url: /certif/Google/Coursera 3DLGWZ6GZOIA.pdf
            - generic [ref=e218]:
              - img [ref=e219]
              - generic [ref=e222]: Google
              - generic [ref=e223]: Certificat
            - generic [ref=e224]:
              - heading "Certification Google 3DLGWZ6GZOIA" [level=3] [ref=e225]
              - generic [ref=e226]:
                - img [ref=e227]
                - generic [ref=e230]: "Année: 2024"
          - 'link "IBM & SkillUP Certificat Certification IBM & SkillUP ZJQCGFYO8QNO Année: 2024" [ref=e232]':
            - /url: /certif/IBM & SkillUP/Coursera ZJQCGFYO8QNO.pdf
            - generic [ref=e234]:
              - img [ref=e235]
              - generic [ref=e238]: IBM & SkillUP
              - generic [ref=e239]: Certificat
            - generic [ref=e240]:
              - heading "Certification IBM & SkillUP ZJQCGFYO8QNO" [level=3] [ref=e241]
              - generic [ref=e242]:
                - img [ref=e243]
                - generic [ref=e246]: "Année: 2024"
        - link "Voir toutes les certificats" [ref=e248]:
          - /url: /about
          - text: Voir toutes les certificats
          - img [ref=e249]
  - contentinfo [ref=e251]:
    - generic [ref=e252]:
      - generic [ref=e253]:
        - generic [ref=e254]:
          - img "Ayoub MOSLIH Logo" [ref=e255]
          - text: Ayoub MOSLIH
        - img "QR Code vCard Ayoub MOSLIH" [ref=e256]
      - generic [ref=e257]:
        - link "LinkedIn" [ref=e258]:
          - /url: https://www.linkedin.com/in/moslih84/
          - img [ref=e259]
        - link "X (Twitter)" [ref=e261]:
          - /url: https://x.com/moslih84
          - img [ref=e262]
        - link "Behance" [ref=e264]:
          - /url: https://www.behance.net/moslih84
          - img [ref=e265]
        - link "YouTube" [ref=e267]:
          - /url: https://www.youtube.com/@moslih84
          - img [ref=e268]
        - link "Dribbble" [ref=e270]:
          - /url: https://dribbble.com/moslih84
          - img [ref=e271]
        - link "Email" [ref=e273]:
          - /url: mailto:moslihayoub@gmail.com
          - img [ref=e274]
      - generic [ref=e276]: © 2026 Ayoub MOSLIH. All rights reserved.
  - generic [ref=e284] [cursor=pointer]:
    - generic [ref=e286]:
      - text: Bonjour ! Je suis votre
      - strong [ref=e287]: Agent M84
      - text: . Comment puis-je vous guider ?
    - button "Fermer" [ref=e288]:
      - img [ref=e289]
  - button "Ouvrir l'Agent M84" [ref=e294]:
    - img "Agent M84" [ref=e296]
  - generic [ref=e297]:
    - generic [ref=e298]:
      - heading "Gérer le consentement" [level=3] [ref=e299]
      - button "Fermer" [ref=e300]:
        - img [ref=e301]
    - paragraph [ref=e304]: Pour vous offrir la meilleure expérience possible, nous utilisons des technologies comme les cookies pour stocker et/ou accéder aux informations de votre appareil. En acceptant ces technologies, vous nous autorisez à traiter des données telles que votre comportement de navigation ou vos identifiants uniques sur ce site. Refuser ou retirer votre consentement peut affecter certaines fonctionnalités.
    - generic [ref=e305]:
      - button "Accepter" [ref=e306]
      - button "Refuser" [ref=e307]
      - button "Afficher les préférences" [ref=e308]
  - generic [ref=e309]:
    - button "Close" [ref=e310]:
      - img [ref=e311]
    - generic [ref=e314]:
      - img "App Icon" [ref=e316]
      - generic [ref=e317]:
        - heading "Ayoub MOSLIH - Portfolio" [level=4] [ref=e318]
        - paragraph [ref=e319]: Install the app to explore my projects.
    - button "Install" [ref=e320]:
      - img [ref=e321]
      - text: Install
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Portfolio E2E Tests', () => {
  4  |   test('Should navigate to protected project The Factory', async ({ page }) => {
  5  |     // 1. Go to homepage
  6  |     await page.goto('http://localhost:5173/');
  7  |     
  8  |     // 2. Click on 'Work' in the navbar
  9  |     await page.getByRole('link', { name: /Work|Réalisations/i }).first().click();
  10 |     
  11 |     // 3. Verify we are on the Work page
  12 |     await expect(page).toHaveURL(/.*\/work/);
  13 |     
  14 |     // 4. Click the 'AI Filmmaking' filter tab
  15 |     await page.getByRole('button', { name: 'AI Filmmaking' }).click();
  16 |     
  17 |     // 5. Click on the project 'The Factory'
  18 |     // Wait for the animation to finish
  19 |     await page.waitForTimeout(1000);
> 20 |     await page.getByText('The Factory').first().click();
     |                                                 ^ Error: locator.click: Test timeout of 30000ms exceeded.
  21 |     
  22 |     // 6. Verify modal opens and enter password
  23 |     const passwordInput = page.locator('input#access-code');
  24 |     await expect(passwordInput).toBeVisible();
  25 |     await passwordInput.fill('031984');
  26 |     
  27 |     // 7. Click submit (the button with type submit inside the modal)
  28 |     await page.locator('form button[type="submit"]').click();
  29 |     
  30 |     // 8. Verify redirect to /project/the-factory
  31 |     await expect(page).toHaveURL(/.*\/project\/the-factory/);
  32 |     
  33 |     // 9. Verify the title "The Factory" exists on the page
  34 |     const title = page.locator('h1', { hasText: 'The Factory' });
  35 |     await expect(title).toBeVisible();
  36 |     
  37 |     // 10. Verify videos are present and native (not iframes)
  38 |     const videos = page.locator('video');
  39 |     const videoCount = await videos.count();
  40 |     expect(videoCount).toBeGreaterThan(0);
  41 |     
  42 |     // 11. Scroll down to trigger ScrollSpy
  43 |     await page.evaluate(() => window.scrollTo(0, 1500));
  44 |     await page.waitForTimeout(1000);
  45 |     
  46 |     await expect(page.getByText('Pré-production').last()).toBeVisible();
  47 |     
  48 |     console.log('✅ End to End test completed successfully!');
  49 |   });
  50 | });
  51 | 
```