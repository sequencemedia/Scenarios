import Logger from 'app/logger';

export default async (page, { brokerCode = '123456789' } = {}) => {
  try {
    await page.waitForSelector('[data-step-index="3"]', { visible: true });
    /*
     *  Weirdness
     */
    await page.click('[data-step-index="3"]');

    await page.evaluate(() => { document.querySelector('[data-step-index="3"] .broker-code').scrollIntoView({ behaviour: 'instant' }); });

    /*
     *  Weirdness: input is not visible so click label
     */
    await page.waitForSelector('[data-step-index="3"] .broker-code label[for="show-broker-code"]', { visible: true });
    await page.click('[data-step-index="3"] .broker-code label[for="show-broker-code"]');

    /*
     *  Wait for input
     */
    await page.waitForSelector('[data-step-index="3"] .broker-code input[type="tel"]', { visible: true });
    await page.type('[data-step-index="3"] .broker-code input[type="tel"]', brokerCode);

    await page.evaluate(() => { document.querySelector('[data-step-index="3"] .proceed-to-checkout').scrollIntoView({ behaviour: 'instant' }); });

    await page.click('[data-step-index="3"] [data-tracking="cta:click:continue-to-checkout"] button.quote-cta-next');
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Step 3 - Apply Broker Code. ${message.trim()}`);
  }
};
