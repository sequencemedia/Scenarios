import Logger from 'app/logger';

import selectSingle from './select-single';
import enterCountry from './enter-country';

export default async (page, params = {}) => {
  try {
    await page.focus('button[data-cover-type="travel"]');
    await page.click('button[data-cover-type="travel"]');

    await selectSingle(page, params);

    await enterCountry(page, params);

    await page.waitForSelector('.quote-continue');
    await page.evaluate(() => { document.querySelector('.quote-continue').scrollIntoView({ behaviour: 'instant' }); });
    await page.waitForSelector('.quote-continue', { visible: true });

    await page.focus('button[data-tracking="click:quote:step-0:cta:continue"]');
    await page.click('button[data-tracking="click:quote:step-0:cta:continue"]');
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Single. ${message.trim()}`);
  }
};
