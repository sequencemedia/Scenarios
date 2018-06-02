/* eslint no-console: "off" */
export default async (page) => {
  try {
    await page.waitForSelector('[data-step-index="2"]', { visible: true });
    /*
     *  Weirdness
     */
    await page.click('[data-step-index="2"]');

    await page.evaluate(() => { document.querySelector('[data-step-index="2"] .your-quote-wrapper').scrollIntoView({ behaviour: 'instant' }); });

    await page.click('[data-step-index="2"] [data-product-index="2"] button.buy-cta');
  } catch ({ message = 'No error message is defined' }) {
    console.error(`Error in Step 2 - Select Basic + Non-Medical + Trip Cancellation. ${message.trim()}`);
  }
};
