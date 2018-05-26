export default async (page) => {
  await page.waitForSelector('.quote-input-container');
  await page.evaluate(() => { document.querySelector('.quote-input-container').scrollIntoView({ behaviour: 'instant' }); });
  await page.waitForSelector('.quote-input-container', { visible: true });

  await page.focus('button[data-cover-period="annual"]');
  await page.click('button[data-cover-period="annual"]');
};
