import Logger from 'app/logger';

export default async (page, { bupaMember = '7777777' } = {}) => {
  try {
    await page.waitForSelector('[data-step-index="3"]', { visible: true });
    /*
     *  Weirdness
     */
    await page.click('[data-step-index="3"]');

    await page.evaluate(() => { document.querySelector('[data-step-index="3"] .bupa-member').scrollIntoView({ behaviour: 'instant' }); });

    await page.type('[data-step-index="3"] .bupa-member input[type="text"]', bupaMember);
    await page.click('[data-step-index="3"] .bupa-member button.cta');
    await page.waitForSelector('[data-step-index="3"] .bupa-member .policy-number-applied', { visible: true });

    await page.evaluate(() => { document.querySelector('[data-step-index="3"] .proceed-to-checkout').scrollIntoView({ behaviour: 'instant' }); });

    await page.click('[data-step-index="3"] [data-tracking="cta:click:continue-to-checkout"] button.quote-cta-next');
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Step 3 - Apply Bupa Member. ${message.trim()}`);
  }
};
