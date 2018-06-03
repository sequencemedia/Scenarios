/* eslint no-shadow: "off", no-param-reassign: "off" */
/*
import { countries } from 'app/countries';

export default async (page, { countryName = 'United Kingdom' }) => {
  await page.waitForSelector('.quote-travel .quote-input-container');

  await page.click('.predicted-country-question a.accept-predicted-country');

  await page.waitForSelector('.quote-travel .quote-input-container');

  const countryIndex = countries.findIndex((country) => country.toLowerCase() === countryName.toLowerCase());

  await page.evaluate(({ countryIndex, countryName }) => {
    const EVENT = { bubbles: true, cancelable: true, view: window };
    const selectedIndex = (countryIndex + 1);

    document.querySelectorAll('#country-quote-travel')
      .forEach((country) => {
        country.dispatchEvent(new FocusEvent('focus', EVENT));
        country.dispatchEvent(new MouseEvent('click', EVENT));
        country.value = countryName;
        country.dispatchEvent(new Event('change', EVENT));
      });

    document.querySelectorAll('.alternative-country-select')
      .forEach((country) => {
        country.dispatchEvent(new FocusEvent('focus', EVENT));
        country.dispatchEvent(new MouseEvent('click', EVENT));
        country.selectedIndex = selectedIndex;
        country.dispatchEvent(new Event('change', EVENT));
      });

    const acceptPredictedCountry = document.querySelector('.accept-predicted-country');
    if (acceptPredictedCountry) acceptPredictedCountry.dispatchEvent(new MouseEvent('click', EVENT));
  }, { countryName, countryIndex });
};
*/

/*
  await page.evaluate(() => { document.querySelectorAll('.quote-travel .alternative-country-container select.alternative-country-select').forEach((select) => select.scrollIntoView()); });
  await page.select('.quote-travel .alternative-country-container select.alternative-country-select', 'United Kingdom');
*/

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

