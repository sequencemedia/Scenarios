import { ensureDir } from 'fs-extra';

import Logger from 'app/logger';

export default async ({ page, ...config }, {
  address: {
    address1 = '4 Callisons Place',
    address2 = 'Bellot Street',
    city = 'Greenwich',
    zip = 'SE10 0AJ'
  } = {}
} = {}) => {
  try {
    await page.waitForSelector('[data-step-index="4"]', { visible: true });
    /*
     *  Weirdness
     */
    await page.click('[data-step-index="4"]');

    await page.evaluate(() => { document.querySelector('[data-step-index="4"] .address-details .row').scrollIntoView({ behaviour: 'instant' }); });

    await page.type('[data-step-index="4"] input#address_1', address1);
    await page.type('[data-step-index="4"] input#address_2', address2);
    await page.type('[data-step-index="4"] input#address_city', city);
    await page.type('[data-step-index="4"] input#address_zip', zip);
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Step 4 - Enter Address. ${message.trim()}`);

    const {
      dir
    } = config;

    await ensureDir(dir);

    await page.screenshot({
      path: `${dir}/step-4-enter-address.png`,
      fullPage: true
    });
  }
};
