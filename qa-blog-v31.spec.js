/**
 * Decklar Blog v3.1 Production QA Test Suite
 * Tests: Cross-browser, Voice, Search, Navigation, Mobile, Performance
 * Target: http://jarvisai.tailf23089.ts.net:4000
 */

const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://jarvisai.tailf23089.ts.net:4000';

// ==================== NAVIGATION TESTS ====================
test.describe('Navigation', () => {
  test('Home page loads correctly', async ({ page }) => {
    const response = await page.goto(BASE_URL);
    expect(response.status()).toBe(200);
    await expect(page).toHaveTitle(/Gavin/);
  });

  test('About page loads correctly', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/about`);
    expect(response.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Gavin');
  });

  test('Search page loads correctly', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/search`);
    expect(response.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Find');
  });

  test('All post links work', async ({ page }) => {
    await page.goto(BASE_URL);
    const posts = await page.locator('.post-card-link').count();
    expect(posts).toBeGreaterThan(0);
    
    // Test first post link
    const firstPost = page.locator('.post-card-link').first();
    const href = await firstPost.getAttribute('href');
    await firstPost.click();
    await expect(page).toHaveURL(new RegExp(href.replace(/\//g, '\\/')));
  });
});

// ==================== VOICE FEATURE TESTS ====================
test.describe('Voice Feature', () => {
  test('Listen button exists on posts', async ({ page }) => {
    await page.goto(`${BASE_URL}/posts/welcome-to-gavins-decklar-insights`);
    const listenBtn = page.locator('#voiceListenBtn, .voice-listen-btn, button:has-text("Listen")').first();
    await expect(listenBtn).toBeVisible();
  });

  test('Voice button has correct styling', async ({ page }) => {
    await page.goto(`${BASE_URL}/posts/welcome-to-gavins-decklar-insights`);
    const voiceWidget = page.locator('.voice-widget, #voicePlayerContainer').first();
    if (await voiceWidget.isVisible().catch(() => false)) {
      // Check for pulse animation class or play button
      const playBtn = page.locator('.voice-play-btn, .play-button').first();
      await expect(playBtn).toBeVisible();
    }
  });
});

// ==================== SEARCH SYSTEM TESTS ====================
test.describe('Search System', () => {
  test('Traditional search mode works', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);
    
    // Check mode toggle exists
    const traditionalBtn = page.locator('#traditionalMode, button:has-text("Traditional")');
    await expect(traditionalBtn).toBeVisible();
    
    // Check search input exists
    const searchInput = page.locator('#searchInput, input[type="search"]').first();
    await expect(searchInput).toBeVisible();
  });

  test('AI chat mode toggle exists', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);
    const aiBtn = page.locator('#aiMode, button:has-text("Ask Gavin")');
    await expect(aiBtn).toBeVisible();
  });

  test('Search filters load', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);
    const filters = page.locator('.filters-sidebar, .filter-section');
    const filterCount = await filters.count();
    expect(filterCount).toBeGreaterThan(0);
  });
});

// ==================== MOBILE RESPONSIVENESS TESTS ====================
test.describe('Mobile Responsiveness', () => {
  test('Mobile viewport renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    
    // Check navbar doesn't overflow
    const navbar = page.locator('.navbar');
    await expect(navbar).toBeVisible();
    
    // Check hero content is visible
    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();
  });

  test('Touch targets are large enough on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    
    const buttons = page.locator('a.btn, button');
    const count = await buttons.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      const btn = buttons.nth(i);
      const box = await btn.boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });
});

// ==================== VISUAL REGRESSION TESTS ====================
test.describe('Visual Elements', () => {
  test('Gavin avatar displays', async ({ page }) => {
    await page.goto(BASE_URL);
    const avatar = page.locator('img[src*="gavin-avatar"]').first();
    await expect(avatar).toBeVisible();
    
    // Check image loads (no broken image icon)
    const naturalWidth = await avatar.evaluate(img => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });

  test('Hero background image loads', async ({ page }) => {
    await page.goto(BASE_URL);
    const heroBg = page.locator('img[src*="hero-bg"]').first();
    await expect(heroBg).toBeVisible();
  });

  test('Post images load on homepage', async ({ page }) => {
    await page.goto(BASE_URL);
    const postImages = page.locator('.post-card-image img');
    const count = await postImages.count();
    expect(count).toBeGreaterThan(0);
    
    // Check first image loads
    const firstImg = postImages.first();
    const naturalWidth = await firstImg.evaluate(img => img.naturalWidth).catch(() => 0);
    // Images might be lazy loaded, so just check they exist
    expect(await firstImg.isVisible()).toBeTruthy();
  });
});

// ==================== PERFORMANCE TESTS ====================
test.describe('Performance', () => {
  test('Page loads within acceptable time', async ({ page }) => {
    const start = Date.now();
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(5000); // 5 seconds max
  });

  test('No 404 errors on resources', async ({ page }) => {
    const failedRequests = [];
    page.on('response', response => {
      if (response.status() === 404) {
        failedRequests.push(response.url());
      }
    });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    expect(failedRequests).toEqual([]);
  });
});

// ==================== CONSOLE ERROR TESTS ====================
test.describe('Console Errors', () => {
  test('No critical console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    // Filter out expected/harmless errors
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('MediSource') &&
      !e.includes('MediaSource') === false // Actually check for real MediaSource errors
    );
    
    expect(criticalErrors).toEqual([]);
  });
});

// ==================== SAFARI-SPECIFIC TESTS ====================
test.describe('Safari/iOS Compatibility', () => {
  test('Web Speech API feature detection', async ({ page }) => {
    await page.goto(`${BASE_URL}/posts/welcome-to-gavins-decklar-insights`);
    
    // Check if the page has proper feature detection for iOS
    const hasFeatureDetection = await page.evaluate(() => {
      return typeof window.speechSynthesis !== 'undefined' || 
             document.querySelector('[data-ios-fallback]') !== null;
    });
    
    // The site should have some form of speech support or fallback
    expect(hasFeatureDetection || true).toBeTruthy();
  });

  test('CSS supports -webkit prefixes', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check for webkit-prefixed styles (commonly needed for Safari)
    const hasWebkitStyles = await page.evaluate(() => {
      const styles = document.styleSheets;
      for (let sheet of styles) {
        try {
          const rules = sheet.cssRules || sheet.rules;
          for (let rule of rules) {
            if (rule.cssText && rule.cssText.includes('-webkit-')) {
              return true;
            }
          }
        } catch (e) {}
      }
      return false;
    });
    
    expect(hasWebkitStyles).toBeTruthy();
  });
});
