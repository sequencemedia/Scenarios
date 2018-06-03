import Logger from 'app/logger';

export default async ({ page }, { campaignCode = 'family15' }) => {
  try {
    await page.waitForSelector('[data-step-index="3"]', { visible: true });
    /*
     *  Weirdness
     */
    await page.click('[data-step-index="3"]');

    await page.evaluate(() => { document.querySelector('[data-step-index="3"] .campaign-code').scrollIntoView({ behaviour: 'instant' }); });

    await page.type('[data-step-index="3"] .campaign-code input[type="text"]', campaignCode);
    await page.click('[data-step-index="3"] .campaign-code button.cta');
    await page.waitForSelector('[data-step-index="3"] .campaign-code .quote-valid', { visible: true });

    await page.evaluate(() => { document.querySelector('[data-step-index="3"] .proceed-to-checkout').scrollIntoView({ behaviour: 'instant' }); });

    await page.click('[data-step-index="3"] [data-tracking="cta:click:continue-to-checkout"] button.quote-cta-next');
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Step 3 - Apply Campaign Code. ${message.trim()}`);
  }
};
