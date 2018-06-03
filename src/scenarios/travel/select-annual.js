import Logger from 'app/logger';

export default async (page) => {
  try {
    await page.waitForSelector('.quote-input-container');
    await page.evaluate(() => { document.querySelector('.quote-input-container').scrollIntoView({ behaviour: 'instant' }); });

    await page.focus('button[data-cover-period="annual"]');
    await page.click('button[data-cover-period="annual"]');
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Select Annual. ${message.trim()}`);
  }
};
