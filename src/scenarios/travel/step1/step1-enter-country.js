import captureScreenshot from 'app/capture-screenshot';
import Logger from 'app/logger';

export default async ({ page, ...config }, { countryName = 'United Kingdom' }) => {
  try {
    await page.waitForSelector('.quote-input-country-container input.quote-input-country');

    const countries = await page.$$('.quote-input-country-container input.quote-input-country');
    countries
      .forEach(async (country) => {
        await country.focus();
        await country.click();
        await country.type(countryName);
      });
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Step 1 - Enter Single Dates. ${message.trim()}`);

    await captureScreenshot({ ...config, page }, 'step-1-enter-country');
  }
};
