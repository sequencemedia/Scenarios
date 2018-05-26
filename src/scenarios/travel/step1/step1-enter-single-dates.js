export default async (page) => {
  await page.waitForSelector('[data-step-index="1"]', { visible: true });
  /*
   *  Weirdness
   */
  await page.click('[data-step-index="1"]');

  await page.waitForSelector('[data-step-index="1"] .single-insurance-period');
  await page.evaluate(() => { document.querySelector('[data-step-index="1"] .single-insurance-period').scrollIntoView({ behaviour: 'instant' }); });

  /*
   *  Weirdness
   */
  await page.focus('[data-step-index="1"] input#startdate');
  await page.click('[data-step-index="1"] input#startdate');

  await page.waitForSelector('.datepicker', { visible: true });

  await page.click('.datepicker .day:not(.disabled)');

  /*
   *  Weirdness
   */
  await page.focus('[data-step-index="1"] input#finishdate');
  await page.click('[data-step-index="1"] input#finishdate');

  await page.waitForSelector('.datepicker', { visible: true });

  await page.click('.datepicker .day:not(.disabled)');
};
