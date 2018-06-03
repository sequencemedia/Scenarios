/* eslint no-nested-ternary: "off" */
import { ensureDir } from 'fs-extra';

import toBool from 'app/to-bool';
import Logger from 'app/logger';

import selectBasic from './step2-select-basic';
import selectBasicNonMedical from './step2-select-basic-non-medical';
import selectBasicNonMedicalTripCancellation from './step2-select-basic-non-medical-trip-cancellation';

export default async ({ page, ...config }, { selectBasic: basic = false, selectBasicNonMedical: basicNonMedical = false, selectBasicNonMedicalTripCancellation: basicNonMedicalTripCancellation = false }) => {
  if (toBool(basic)) await selectBasic({ ...config, page });
  else if (toBool(basicNonMedical)) await selectBasicNonMedical({ ...config, page });
  else if (toBool(basicNonMedicalTripCancellation)) await selectBasicNonMedicalTripCancellation({ ...config, page });
  else {
    try {
      await page.waitForSelector('[data-step-index="2"]', { visible: true });
      /*
       *  Weirdness
       */
      await page.click('[data-step-index="2"]');
      await page.evaluate(() => { document.querySelector('[data-step-index="2"] .your-quote-wrapper').scrollIntoView({ behaviour: 'instant' }); });

      await page.click('[data-step-index="2"] button.buy-cta');
    } catch ({ message = 'No error message is defined' }) {
      Logger.error(`Error in Step 2. ${message.trim()}`);

      const {
        dir,
        w: width,
        h: height
      } = config;

      await ensureDir(dir);

      await page.screenshot({
        path: `${dir}/step-2.png`,
        fullPage: true,
        clip: {
          x: 0,
          y: 0,
          width,
          height
        }
      });
    }
  }
};
