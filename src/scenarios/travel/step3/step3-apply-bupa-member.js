import { ensureDir } from 'fs-extra';

import Logger from 'app/logger';

export default async ({ page, ...config }, { bupaMember = '7777777' } = {}) => {
  try {
    await page.waitForSelector('[data-step-index="3"]', { visible: true });
    /*
     *  Weirdness
     */
    await page.click('[data-step-index="3"]');

    {
      const selector = await page.waitForSelector('[data-step-index="3"] .bupa-member', { visible: true });
      await page.evaluate(() => { document.querySelector('[data-step-index="3"] .bupa-member').scrollIntoView({ behaviour: 'instant' }); });
      await selector;
    }

    await page.type('[data-step-index="3"] .bupa-member input[type="text"]', bupaMember);

    {
      const selector = page.waitForSelector('[data-step-index="3"] .bupa-member .policy-number-applied', { visible: true });
      await page.click('[data-step-index="3"] .bupa-member button.cta');
      await selector;
    }

    {
      const selector = page.waitForSelector('[data-step-index="3"] .proceed-to-checkout', { visible: true });
      await page.evaluate(() => { document.querySelector('[data-step-index="3"] .proceed-to-checkout').scrollIntoView({ behaviour: 'instant' }); });
      await selector;
    }

    await page.click('[data-step-index="3"] [data-tracking="cta:click:continue-to-checkout"] button.quote-cta-next');
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Step 3 - Apply Bupa Member. ${message.trim()}`);

    const {
      dir
    } = config;

    await ensureDir(dir);

    await page.screenshot({
      path: `${dir}/step-3-bupa-member.png`,
      fullPage: true
    });
  }
};
