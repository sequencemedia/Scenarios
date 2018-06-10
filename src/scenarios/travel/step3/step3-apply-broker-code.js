import captureScreenshot from 'app/capture-screenshot';
import Logger from 'app/logger';

export default async ({ page, ...config }, { brokerCode = '123456789' } = {}) => {
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
      const selector = await page.waitForSelector('[data-step-index="3"] .broker-code', { visible: true });
      await page.evaluate(() => { document.querySelector('[data-step-index="3"] .broker-code').scrollIntoView({ behaviour: 'instant' }); });
      await selector;
    }

    /*
     *  Weirdness: input is not visible so click label
     */
    await page.waitForSelector('[data-step-index="3"] .broker-code label[for="show-broker-code"]', { visible: true });
    await page.click('[data-step-index="3"] .broker-code label[for="show-broker-code"]');

    /*
     *  Wait for input
     */
    {
      const selector = page.waitForSelector('[data-step-index="3"] .broker-code input[type="tel"]', { visible: true });
      await page.type('[data-step-index="3"] .broker-code input[type="tel"]', brokerCode);
      await selector;
    }
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Step 3 - Apply Broker Code. ${message.trim()}`);

    await captureScreenshot({ ...config, page }, 'step-3-broker-code');
  }
};
