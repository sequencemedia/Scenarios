import selectAnnual from './select-annual';
import enterCountry from './enter-country';

export default async (page, params = {}) => {
  await page.focus('button[data-cover-type="travel"]');
  await page.click('button[data-cover-type="travel"]');

  await selectAnnual(page, params);

  await enterCountry(page, params);

  await page.waitForSelector('.quote-continue');
  await page.evaluate(() => { document.querySelector('.quote-continue').scrollIntoView({ behaviour: 'instant' }); });
  await page.waitForSelector('.quote-continue', { visible: true });

  await page.focus('button[data-tracking="click:quote:step-0:cta:continue"]');
  await page.click('button[data-tracking="click:quote:step-0:cta:continue"]');
};
