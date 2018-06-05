import { ensureDir } from 'fs-extra';

import Logger from 'app/logger';

export default async ({ page, ...config }) => {
  try {
    await page.waitForSelector('.quote-input-container');
    await page.evaluate(() => { document.querySelector('.quote-input-container').scrollIntoView({ behaviour: 'instant' }); });

    await page.focus('button[data-cover-period="single"]');
    await page.click('button[data-cover-period="single"]');
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Select Single. ${message.trim()}`);

    const {
      dir
    } = config;

    await ensureDir(dir);

    await page.screenshot({
      path: `${dir}/select-single.png`,
      fullPage: true
    });
  }
};
