import captureScreenshot from 'app/capture-screenshot';
import Logger from 'app/logger';

export default async ({ page, ...config }) => {
  try {
    await page.waitForSelector('section.altapay-main-container');
    await page.type('#creditCardNumberInput', '4444444444444444');
    await page.type('#cvcInput', '123');

    {
      const selector = page.waitForSelector('input[type="submit"]', { visible: true });
      await page.evaluate(() => { document.querySelector('input[type="submit"]').scrollIntoView({ behaviour: 'instant' }); });
      await selector;
    }

    {
      const navigation = page.waitForNavigation({ waitUntil: ['networkidle2', 'load'] });
      await page.click('input[type="submit"]');
      await navigation;
    }
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Altapay. ${message.trim()}`);

    await captureScreenshot({ ...config, page }, 'altapay');
  }
};
