
export default async (page, { countryName = 'United Kingdom' }) => {
  await page.waitForSelector('.quote-input-country-container input.quote-input-country');

  const countries = await page.$$('.quote-input-country-container input.quote-input-country');
  countries
    .forEach(async (country) => {
      await country.focus();
      await country.click();
      await country.type(countryName);
    });
};
