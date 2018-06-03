import { ensureDir } from 'fs-extra';

import Logger from 'app/logger';

export default async ({ page, ...config }) => {
  try {
    await page.waitForSelector('[data-step-index="2"]', { visible: true });
    /*
     *  Weirdness
     */
    await page.click('[data-step-index="2"]');

    await page.evaluate(() => { document.querySelector('[data-step-index="2"] .your-quote-wrapper').scrollIntoView({ behaviour: 'instant' }); });

    await page.click('[data-step-index="2"] [data-product-index="0"] button.buy-cta');
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Step 2 - Select Basic. ${message.trim()}`);

    const {
      dir,
      w: width,
      h: height
    } = config;

    await ensureDir(dir);

    await page.screenshot({
      path: `${dir}/step-2-select-basic.png`,
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
