import captureScreenshot from 'app/capture-screenshot';
import Logger from 'app/logger';

export default async ({ page, ...config }, {
  profile: {
    title = 'Mr',
    firstName = 'Jonathan',
    lastName = 'Perry',
    day = '15',
    month = '10',
    year = '1973'
  } = {}
} = {}) => {
  try {
    await page.waitForSelector('[data-step-index="1"]', { visible: true });
    /*
     *  Weirdness
     */
    await page.click('[data-step-index="1"]');

    await page.waitForSelector('[data-step-index="1"] .about-members');

    {
      const selector = page.waitForSelector('[data-step-index="1"] .about-members', { visible: true });
      await page.evaluate(() => { document.querySelector('[data-step-index="1"] .about-members').scrollIntoView({ behaviour: 'instant' }); });
      await selector;
    }

    await page.type('[data-step-index="1"] select#business-title', title);
    await page.type('[data-step-index="1"] input#first-name', firstName);
    await page.type('[data-step-index="1"] input#last-name', lastName);
    await page.type('[data-step-index="1"] input#date-day', day);
    await page.type('[data-step-index="1"] input#date-month', month);
    await page.type('[data-step-index="1"] input#date-year', year);
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Step 1 - Enter Single Dates. ${message.trim()}`);

    await captureScreenshot({ ...config, page }, 'step-1-enter-profile');
  }
};
