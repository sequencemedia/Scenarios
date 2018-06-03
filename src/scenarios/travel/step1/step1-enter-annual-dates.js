import { ensureDir } from 'fs-extra';

import Logger from 'app/logger';

export default async ({ page, ...config }) => {
  try {
    await page.waitForSelector('[data-step-index="1"]', { visible: true });
    /*
     *  Weirdness
     */
    await page.click('[data-step-index="1"]');

    await page.waitForSelector('[data-step-index="1"] .annual-insurance-period');
    await page.evaluate(() => { document.querySelector('[data-step-index="1"] .annual-insurance-period').scrollIntoView({ behaviour: 'instant' }); });

    /*
     *  Weirdness
     */
    await page.focus('[data-step-index="1"] select#month-select');
    await page.click('[data-step-index="1"] select#month-select');

    await page.evaluate(() => { document.querySelector('[data-step-index="1"] select#month-select').selectedIndex = 1; });
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Step 1 - Enter Single Dates. ${message.trim()}`);

    const {
      dir,
      w: width,
      h: height
    } = config;

    await ensureDir(dir);

    await page.screenshot({
      path: `${dir}/step-1-enter-annual-dates.png`,
      fullPage: true,
      clip: {
        x: 0,
        y: 0,
        width,
        height
      }
    });
  }
};
