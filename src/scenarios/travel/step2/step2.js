/* eslint no-nested-ternary: "off" */

import toBool from '../../../to-bool';

import selectBasic from './step2-select-basic';
import selectBasicNonMedical from './step2-select-basic-non-medical';
import selectBasicNonMedicalTripCancellation from './step2-select-basic-non-medical-trip-cancellation';

export default async (page, { selectBasic: basic = false, selectBasicNonMedical: basicNonMedical = false, selectBasicNonMedicalTripCancellation: basicNonMedicalTripCancellation = false }) => {
  await page.waitForSelector('[data-step-index="2"]', { visible: true });
  /*
   *  Weirdness
   */
  await page.click('[data-step-index="2"]');

  /*
  console.info({
    basic,
    basicNonMedical,
    basicNonMedicalTripCancellation
  });
  */

  if (toBool(basic)) await selectBasic(page);
  else if (toBool(basicNonMedical)) await selectBasicNonMedical(page);
  else if (toBool(basicNonMedicalTripCancellation)) await selectBasicNonMedicalTripCancellation(page);
  else {
    await page.evaluate(() => { document.querySelector('[data-step-index="2"] .your-quote-wrapper').scrollIntoView({ behaviour: 'instant' }); });

    await page.click('[data-step-index="2"] button.buy-cta');
  }
};
