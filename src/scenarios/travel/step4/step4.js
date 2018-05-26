import enterAddress from './step4-enter-address';
import enterEmail from './step4-enter-email';

export default async (page, params = {}) => {
  await page.waitForSelector('[data-step-index="4"]', { visible: true });
  /*
   *  Weirdness
   */
  await page.click('[data-step-index="4"]');

  await enterAddress(page, params);

  await enterEmail(page, params);

  /*
   *  There's some more weirdness with this fake checkbox/button combination
   */

  await page.click('[data-step-index="4"] .accept-conditions');
  await page.evaluate(() => { document.querySelector('[data-step-index="4"] .accept-conditions .tickbox-input').scrollIntoView({ behaviour: 'instant' }); });

  await page.focus('[data-step-index="4"] .accept-conditions .tickbox-input');
  await page.click('[data-step-index="4"] .accept-conditions .tickbox-input');

  await page.click('[data-step-index="4"] .accept-conditions');
  await page.evaluate(() => { document.querySelector('[data-step-index="4"] .accept-conditions .buy-btn a').scrollIntoView({ behaviour: 'instant' }); });

  await page.focus('[data-step-index="4"] .accept-conditions .buy-btn a');
  await page.click('[data-step-index="4"] .accept-conditions .buy-btn a');
};
