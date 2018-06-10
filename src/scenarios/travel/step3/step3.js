import captureScreenshot from 'app/capture-screenshot';
import toBool from 'app/to-bool';
import Logger from 'app/logger';

import applyCampaignCode from './step3-apply-campaign-code';
import applyBupaMember from './step3-apply-bupa-member';
import applyBrokerCode from './step3-apply-broker-code';

export default async ({
  page,
  ...config
}, {
    applyCampaignCode: campaignCode = false,
    applyBupaMember: bupaMember = false,
    applyBrokerCode: brokerCode = false,
    ...params
  }) => {
  try {
    if (toBool(campaignCode)) {
      await applyCampaignCode({ ...config, page }, {
        ...params,
        applyCampaignCode: campaignCode,
        applyBupaMember: bupaMember,
        applyBrokerCode: brokerCode
      });
    }
    if (toBool(bupaMember)) {
      await applyBupaMember({ ...config, page }, {
        ...params,
        applyCampaignCode: campaignCode,
        applyBupaMember: bupaMember,
        applyBrokerCode: brokerCode
      });
    }
    if (toBool(brokerCode)) {
      await applyBrokerCode({ ...config, page }, {
        ...params,
        applyCampaignCode: campaignCode,
        applyBupaMember: bupaMember,
        applyBrokerCode: brokerCode
      });
    }

    {
      /*
       *  Weirdness
       */
      const selector = page.waitForSelector('[data-step-index="3"]', { visible: true });
      await page.evaluate(() => { document.querySelector('[data-step-index="3"]').scrollIntoView({ behaviour: 'instant' }); });
      await selector;

      /*
       *  Weirdness
       */
      await page.click('[data-step-index="3"]');
    }

    {
      const selector = page.waitForSelector('[data-step-index="3"] .proceed-to-checkout', { visible: true });
      await page.evaluate(() => { document.querySelector('[data-step-index="3"] .proceed-to-checkout').scrollIntoView({ behaviour: 'instant' }); });
      await selector;
    }

    await page.click('[data-step-index="3"] [data-tracking="cta:click:continue-to-checkout"] button.quote-cta-next');
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Step 3. ${message.trim()}`);

    await captureScreenshot({ ...config, page }, 'step-3');
  }
};
