/* eslint no-console: "off" */
export default async (page) => {
  try {
    await page.waitForSelector('[data-step-index="3"]', { visible: true });
    /*
     *  Weirdness
     */
    await page.click('[data-step-index="3"]');

    await page.evaluate(() => { document.querySelector('[data-step-index="3"] .proceed-to-checkout').scrollIntoView({ behaviour: 'instant' }); });

    await page.click('[data-step-index="3"] [data-tracking="cta:click:continue-to-checkout"] button.quote-cta-next');
  } catch ({ message = 'No error message is defined' }) {
    console.error(`Error in Step 3. ${message.trim()}`);
  }
};
