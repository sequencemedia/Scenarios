/* eslint no-console: "off" */
export default async (page, { countryName = 'United Kingdom' }) => {
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
    console.error(`Error in Step 1 - Enter Single Dates. ${message.trim()}`);
  }
};
