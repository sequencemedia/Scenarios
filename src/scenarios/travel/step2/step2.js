/* eslint no-console: "off", no-nested-ternary: "off" */
import toBool from 'app/to-bool';

import selectBasic from './step2-select-basic';
import selectBasicNonMedical from './step2-select-basic-non-medical';
import selectBasicNonMedicalTripCancellation from './step2-select-basic-non-medical-trip-cancellation';

export default async (page, { selectBasic: basic = false, selectBasicNonMedical: basicNonMedical = false, selectBasicNonMedicalTripCancellation: basicNonMedicalTripCancellation = false }) => {
  if (toBool(basic)) await selectBasic(page);
  else if (toBool(basicNonMedical)) await selectBasicNonMedical(page);
  else if (toBool(basicNonMedicalTripCancellation)) await selectBasicNonMedicalTripCancellation(page);
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
      console.error(`Error in Step 2. ${message.trim()}`);
    }
  }
};
