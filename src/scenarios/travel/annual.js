import captureScreenshot from 'app/capture-screenshot';
import Logger from 'app/logger';

import selectAnnual from './select-annual';
import enterCountry from './enter-country';

export default async ({ page, ...config }, params = {}) => {
  try {
    await page.focus('button[data-cover-type="travel"]');
    await page.click('button[data-cover-type="travel"]');

    await selectAnnual({ ...config, page }, params);

    await enterCountry({ ...config, page }, params);

    await page.waitForSelector('.quote-continue');

    {
      const selector = page.waitForSelector('.quote-continue', { visible: true });
      await page.evaluate(() => { document.querySelector('.quote-continue').scrollIntoView({ behaviour: 'instant' }); });
      await selector;
    }

    {
      const navigation = page.waitForNavigation({ waitUntil: ['networkidle2', 'load'] });
      await page.focus('button[data-tracking="click:quote:step-0:cta:continue"]');
      await page.click('button[data-tracking="click:quote:step-0:cta:continue"]');
      await navigation
        .catch(({ message = 'No error message is defined' }) => {
          Logger.error(`Error in Annual navigation. ${message.trim()}`);

          return captureScreenshot({ ...config, page }, 'annual');
        });
    }
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Annual. ${message.trim()}`);

    await captureScreenshot({ ...config, page }, 'annual');
  }
};
