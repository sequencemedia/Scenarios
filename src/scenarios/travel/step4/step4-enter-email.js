import Logger from 'app/logger';

export default async (page, { contact: { email = 'jonathan.perry@valtech.co.uk' } = {} } = {}) => {
  try {
    await page.waitForSelector('[data-step-index="4"]', { visible: true });
    /*
     *  Weirdness
     */
    await page.click('[data-step-index="4"]');

    await page.evaluate(() => { document.querySelector('[data-step-index="4"] .address-email .email-block').scrollIntoView({ behaviour: 'instant' }); });

    await page.type('[data-step-index="4"] input.email-address-js', email);
    await page.type('[data-step-index="4"] input.confirm-email-address-js', email);
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Step 4 - Enter Email. ${message.trim()}`);
  }
};
