import { test, expect } from '@playwright/test';

const article = '/events/openai-misalignment-reporting-framework-six-reports';

for (const javaScriptEnabled of [true, false]) {
  test.describe(`article navigation with JavaScript ${javaScriptEnabled ? 'enabled' : 'disabled'}`, () => {
    test.use({ javaScriptEnabled });

    test('screen navigation remains visible and usable', async ({ page }) => {
      await page.goto(article);
      const contents = page.locator('#article-contents');
      const shortcut = page.locator('.wiki-article__references-link');
      await expect(contents).toBeVisible();
      await expect(shortcut).toBeVisible();

      if (javaScriptEnabled && test.info().project.name === 'chromium') {
        await expect(page.locator('.wiki-rail #article-contents')).toBeVisible();
        await expect(contents.locator('details')).toHaveAttribute('open', '');
      } else {
        await expect(page.locator('.wiki-article > #article-contents')).toBeVisible();
        await contents.locator('summary').click();
      }
      await contents.getByRole('link', { name: 'References', exact: true }).click();
      await expect(page.locator('#refs-head')).toBeInViewport();
      await shortcut.click();
      await expect(page.locator('#refs-head')).toBeInViewport();
    });

    // Letter is 816 x 1056 CSS pixels; one-inch margins leave 624 x 864.
    for (const viewport of [{ width: 816, height: 1056 }, { width: 624, height: 864 }]) {
      test(`Letter print at ${viewport.width}px removes navigation space and retains article content`, async ({ page }) => {
        await page.goto(article);
        await page.emulateMedia({ media: 'print' });
        await page.setViewportSize(viewport);
        for (const selector of ['#article-contents', '.wiki-article__references-link']) {
          const navigation = page.locator(selector);
          await expect(navigation).toHaveCount(1);
          await expect(navigation).toBeHidden();
          expect(await navigation.evaluate((el) => el.getClientRects().length)).toBe(0);
        }
        await expect(page.locator('.wiki-article__title')).toBeVisible();
        await expect(page.locator('.wiki-article__lead p').first()).toBeVisible();
        await expect(page.locator('.wiki-article__prose p').first()).toBeVisible();
        await expect(page.locator('.wiki-article__metadata .wiki-infobox')).toBeVisible();
        await expect(page.locator('#refs-head')).toBeVisible();
        await expect(page.locator('.wiki-article__references ol li').first()).toBeVisible();
      });
    }
  });
}
