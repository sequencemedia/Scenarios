import captureScreenshot from 'app/capture-screenshot';
import Logger from 'app/logger';

export default async ({ page, ...config }) => {
  try {
    await page.waitForSelector('[data-step-index="2"]', { visible: true });
    /*
     *  Weirdness
     */
    await page.click('[data-step-index="2"]');

    {
      const selector = page.waitForSelector('[data-step-index="2"] .your-quote-wrapper', { visible: true });
      await page.evaluate(() => { document.querySelector('[data-step-index="2"] .your-quote-wrapper').scrollIntoView({ behaviour: 'instant' }); });
      await selector;
    }

    await page.click('[data-step-index="2"] [data-product-index="1"] button.buy-cta');
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Step 2 - Select Basic + Non-Medical. ${message.trim()}`);

    await captureScreenshot({ ...config, page }, 'step-2-select-basic-non-medical');
  }
};
