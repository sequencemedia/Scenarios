export default async (page) => {
  await page.waitForSelector('[data-step-index="2"]', { visible: true });
  /*
   *  Weirdness
   */
  await page.click('[data-step-index="2"]');

  await page.evaluate(() => { document.querySelector('[data-step-index="2"] .your-quote-wrapper').scrollIntoView({ behaviour: 'instant' }); });
  await page.waitForSelector('[data-step-index="2"] .your-quote-wrapper', { visible: true });

  await page.click('[data-step-index="2"] [data-product-index="1"] button.buy-cta');
};
