export default async (page) => {
  await page.waitForSelector('section.altapay-main-container');
  await page.type('#creditCardNumberInput', '4444444444444444');
  await page.type('#cvcInput', '123');

  await page.evaluate(() => { document.querySelector('input[type="submit"]').scrollIntoView({ behaviour: 'instant' }); });
  await page.click('input[type="submit"]');
};