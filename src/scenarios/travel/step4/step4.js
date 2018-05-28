/* eslint no-nested-ternary: "off" */
import toBool from 'app/to-bool';

import enterAddress from './step4-enter-address';
import enterEmail from './step4-enter-email';
import selectOptIn from './step4-select-opt-in';
import selectAcceptCondition from './step4-select-accept-conditions';

export default async (page, { selectOptIn: optIn = false, selectAcceptConditions: acceptConditions = true, ...params } = {}) => {
  await page.waitForSelector('[data-step-index="4"]', { visible: true });
  /*
   *  Weirdness
   */
  await page.click('[data-step-index="4"]');

  await enterAddress(page, params);

  await enterEmail(page, params);

  if (toBool(optIn)) await selectOptIn(page, params);
  if (toBool(acceptConditions)) await selectAcceptCondition(page, params);

  await page.click('[data-step-index="4"] .accept-conditions');
  await page.evaluate(() => { document.querySelector('[data-step-index="4"] .accept-conditions .buy-btn a').scrollIntoView({ behaviour: 'instant' }); });

  await page.focus('[data-step-index="4"] .accept-conditions .buy-btn a');
  await page.click('[data-step-index="4"] .accept-conditions .buy-btn a');
};
