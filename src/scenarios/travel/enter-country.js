/* eslint no-shadow: "off", no-param-reassign: "off" */
import toBool from 'app/to-bool';
import Logger from 'app/logger';

export default async (page, { selectPredictedCountry = false, countryName = 'United Kingdom' }) => {
  try {
    await page.waitForSelector('.quote-travel .quote-input-container');

    if (toBool(selectPredictedCountry)) await page.click('.predicted-country-question a.accept-predicted-country');
    else {
      await page.evaluate(() => { document.querySelector('.quote-travel .quote-input-container input.quote-input-country').scrollIntoView({ behaviour: 'instant' }); }); // .forEach((input) => input.scrollIntoView({ behaviour: 'instant' })); });
      await page.waitForSelector('.quote-travel .quote-input-container input.quote-input-country', { visible: true });

      await page.focus('.quote-travel .quote-input-container input.quote-input-country');
      await page.click('.quote-travel .quote-input-container input.quote-input-country', { clickCount: 3 });
      await page.keyboard.press('Backspace');
      await page.type('.quote-travel .quote-input-container input.quote-input-country', countryName);
      await page.evaluate(() => {
        document.querySelector('.quote-travel .quote-input-container input.quote-input-country')
          .dispatchEvent(new Event('change', { bubbles: true, cancelable: true, view: window }));
      });
    }
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Enter Country. ${message.trim()}`);
  }
};
