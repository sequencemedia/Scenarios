import captureScreenshot from 'app/capture-screenshot';
import Logger from 'app/logger';

export default async ({ page, ...config }, { bupaMember = '7777777' } = {}) => {
  try {
    {
      /*
       *  Weirdness
       */
      const selector = page.waitForSelector('[data-step-index="3"]', { visible: true });
      await page.evaluate(() => { document.querySelector('[data-step-index="3"]').scrollIntoView({ behaviour: 'instant' }); });
      await selector;

      /*
       *  Weirdness
       */
      await page.click('[data-step-index="3"]');
    }

    {
      const selector = page.waitForSelector('[data-step-index="3"] .bupa-member', { visible: true });
      await page.evaluate(() => { document.querySelector('[data-step-index="3"] .bupa-member').scrollIntoView({ behaviour: 'instant' }); });
      await selector;
    }

    await page.type('[data-step-index="3"] .bupa-member input[type="text"]', bupaMember);

    {
      const selector = page.waitForSelector('[data-step-index="3"] .bupa-member .policy-number-applied', { visible: true });
      await page.click('[data-step-index="3"] .bupa-member button.cta');
      await selector;
    }
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Step 3 - Apply Bupa Member. ${message.trim()}`);

    await captureScreenshot({ ...config, page }, 'step-3-bupa-member');
  }
};
