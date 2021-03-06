import captureScreenshot from 'app/capture-screenshot';
import toBool from 'app/to-bool';
import Logger from 'app/logger';

import enterAddress from './step4-enter-address';
import enterEmail from './step4-enter-email';
import selectOptIn from './step4-select-opt-in';
import selectAcceptCondition from './step4-select-accept-conditions';

export default async ({ page, ...config }, { selectOptIn: optIn = false, selectAcceptConditions: acceptConditions = true, ...params } = {}) => {
  try {
    await page.waitForSelector('[data-step-index="4"]', { visible: true });
    /*
     *  Weirdness
     */
    await page.click('[data-step-index="4"]');

    await enterAddress({ ...config, page }, params);

    await enterEmail({ ...config, page }, params);

    if (toBool(optIn)) await selectOptIn({ ...config, page }, params);
    if (toBool(acceptConditions)) await selectAcceptCondition({ ...config, page }, params);

    await page.click('[data-step-index="4"] .accept-conditions');

    {
      const selector = page.waitForSelector('[data-step-index="4"] .accept-conditions .buy-btn a', { visible: true });
      await page.evaluate(() => { document.querySelector('[data-step-index="4"] .accept-conditions .buy-btn a').scrollIntoView({ behaviour: 'instant' }); });
      await selector;
    }

    {
      const navigation = page.waitForNavigation({ waitUntil: ['networkidle2', 'load'] });
      await page.focus('[data-step-index="4"] .accept-conditions .buy-btn a');
      await page.click('[data-step-index="4"] .accept-conditions .buy-btn a');
      await navigation;
    }
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Step 4. ${message.trim()}`);

    await captureScreenshot({ ...config, page }, 'step-4');
  }
};
