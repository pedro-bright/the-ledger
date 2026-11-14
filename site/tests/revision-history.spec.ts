import { test, expect } from '@playwright/test';
import { SLUGS } from './_slugs';

const revisionHistory = (page: import('@playwright/test').Page) =>
  page.locator('section').filter({ has: page.getByRole('heading', { level: 2, name: 'Revision history' }) });

for (const javaScriptEnabled of [true, false]) {
  test.describe(`revision history with JavaScript ${javaScriptEnabled ? 'enabled' : 'disabled'}`, () => {
    test.use({ javaScriptEnabled });

    test('a revised event shows the date, reason and both summaries', async ({ page }) => {
      await page.goto('/events/openai-gpt-5-release/');
      const section = revisionHistory(page);
      await expect(section).toBeVisible();
      await expect(section.getByRole('heading', { level: 3, name: /Summary revised/ })).toContainText('2026-10-26');
      await expect(section).toContainText('The primary announcement is dated August 7, 2025; April 14, 2025 was the GPT-4.1 API launch.');
      await expect(section).toContainText('OpenAI released GPT-5 on August 7, 2025, introducing a unified system');

      const earlier = section.getByText('OpenAI released GPT-5, unifying its previously separate model lines');
      await expect(earlier).toBeHidden();
      await section.getByText('Show the earlier summary').click();
      await expect(earlier).toBeVisible();
    });

    test('a challenged event shows the challenge status, allegations and resolution', async ({ page }) => {
      await page.goto('/events/coe-ai-convention-in-force/');
      const section = revisionHistory(page);
      const challenge = section.getByRole('listitem').filter({ has: page.getByRole('heading', { level: 3, name: /Challenge opened/ }) });
      await expect(challenge).toContainText('2026-10-26');
      await expect(challenge).toContainText(/Status\s*sustained/);
      await expect(challenge).toContainText(/Allegations\s*timeline error, unsupported inference/);
      await expect(challenge).toContainText(/Resolution\s*sustained/);
      await expect(challenge.locator('time[datetime="2026-11-14"]')).toHaveText('2026-11-14');
      await expect(challenge).toContainText('lists two ratifications, by the European Union on May 15, 2026');

      await expect(page.locator('#article-contents a[href="#revision-history"]')).toHaveText('Revision history');
      await page.locator('a[href="#revision-history"]').filter({ hasText: 'Contested', visible: true }).first().click();
      await expect(page.getByRole('heading', { level: 2, name: 'Revision history' })).toBeInViewport();
    });
  });
}

test('an event without correction records has no revision history section', async ({ page }) => {
  await page.goto(`/events/${SLUGS.event}`);
  await expect(page.getByRole('heading', { name: 'Revision history' })).toHaveCount(0);
  await expect(page.locator('a[href="#revision-history"]')).toHaveCount(0);
});

test('the revision history prints after the body with the earlier summary', async ({ page }) => {
  await page.goto('/events/openai-gpt-5-release/');
  await page.emulateMedia({ media: 'print' });
  const heading = page.getByRole('heading', { level: 2, name: 'Revision history' });
  await expect(heading).toBeVisible();
  await expect(page.getByText('OpenAI released GPT-5, unifying its previously separate model lines')).toBeVisible();
  const order = await heading.evaluate((h) => {
    const body = document.querySelector('.wiki-article__body')!;
    const refs = document.querySelector('#refs-head')!;
    return {
      afterBody: !!(body.compareDocumentPosition(h) & Node.DOCUMENT_POSITION_FOLLOWING),
      beforeRefs: !!(h.compareDocumentPosition(refs) & Node.DOCUMENT_POSITION_FOLLOWING),
    };
  });
  expect(order).toEqual({ afterBody: true, beforeRefs: true });
});
