import captureScreenshot from 'app/capture-screenshot';
import Logger from 'app/logger';

export default async ({ page, ...config }, { campaignCode = 'family15' }) => {
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
      const selector = page.waitForSelector('[data-step-index="3"] .campaign-code', { visible: true });
      await page.evaluate(() => { document.querySelector('[data-step-index="3"] .campaign-code').scrollIntoView({ behaviour: 'instant' }); });
      await selector;
    }

    await page.type('[data-step-index="3"] .campaign-code input[type="text"]', campaignCode);

    {
      const selector = page.waitForSelector('[data-step-index="3"] .campaign-code .quote-valid', { visible: true });
      await page.click('[data-step-index="3"] .campaign-code button.cta');
      await selector;
    }
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Step 3 - Apply Campaign Code. ${message.trim()}`);

    await captureScreenshot({ ...config, page }, 'step-3-apply-campaign-code');
  }
};
