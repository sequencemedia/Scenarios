import captureScreenshot from 'app/capture-screenshot';
import Logger from 'app/logger';

export default async ({ page, ...config }) => {
  try {
    await page.waitForSelector('[data-step-index="1"]', { visible: true });
    /*
     *  Weirdness
     */
    await page.click('[data-step-index="1"]');

    await page.waitForSelector('[data-step-index="1"] .single-insurance-period');

    {
      const selector = page.waitForSelector('[data-step-index="1"] .single-insurance-period', { visible: true });
      await page.evaluate(() => { document.querySelector('[data-step-index="1"] .single-insurance-period').scrollIntoView({ behaviour: 'instant' }); });
      await selector;
    }

    /*
     *  Weirdness
     */
    {
      const selector = page.waitForSelector('.datepicker', { visible: true });
      await page.focus('[data-step-index="1"] input#startdate');
      await page.click('[data-step-index="1"] input#startdate');
      await selector;
    }

    await page.click('.datepicker .day:not(.disabled)');
    /*
     *  Weirdness
     */
    {
      const selector = page.waitForSelector('.datepicker', { visible: true });
      await page.focus('[data-step-index="1"] input#finishdate');
      await page.click('[data-step-index="1"] input#finishdate');
      await selector;
    }

    await page.click('.datepicker .day:not(.disabled)');
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Step 1 - Enter Single Dates. ${message.trim()}`);

    await captureScreenshot({ ...config, page }, 'step-1-enter-single-dates');
  }
};
