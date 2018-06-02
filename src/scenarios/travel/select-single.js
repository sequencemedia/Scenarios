/* eslint no-console: "off" */
export default async (page) => {
  try {
    await page.waitForSelector('.quote-input-container');
    await page.evaluate(() => { document.querySelector('.quote-input-container').scrollIntoView({ behaviour: 'instant' }); });

    await page.focus('button[data-cover-period="single"]');
    await page.click('button[data-cover-period="single"]');
  } catch ({ message = 'No error message is defined' }) {
    console.error(`Error in Select Single. ${message.trim()}`);
  }
};
