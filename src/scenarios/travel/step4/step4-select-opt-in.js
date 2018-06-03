import Logger from 'app/logger';

export default async ({ page }) => {
  try {
    await page.waitForSelector('[data-step-index="4"]', { visible: true });
    /*
     *  Weirdness
     */
    await page.click('[data-step-index="4"]');

    /*
     *  There's some more weirdness with this fake checkbox/button combination
     */

    await page.click('[data-step-index="4"] .marketing-opt-in');
    await page.evaluate(() => { document.querySelector('[data-step-index="4"] .marketing-opt-in .tickbox-input').scrollIntoView({ behaviour: 'instant' }); });

    await page.focus('[data-step-index="4"] .marketing-opt-in .tickbox-input');
    await page.click('[data-step-index="4"] .marketing-opt-in .tickbox-input');
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Step 4 - Select Opt-In. ${message.trim()}`);
  }
};
