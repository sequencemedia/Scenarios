/* eslint no-console: "off" */
export default async (page) => {
  try {
    await page.waitForSelector('[data-step-index="1"]', { visible: true });
    /*
     *  Weirdness
     */
    await page.click('[data-step-index="1"]');

    await page.waitForSelector('[data-step-index="1"] .annual-insurance-period');
    await page.evaluate(() => { document.querySelector('[data-step-index="1"] .annual-insurance-period').scrollIntoView({ behaviour: 'instant' }); });

    /*
     *  Weirdness
     */
    await page.focus('[data-step-index="1"] select#month-select');
    await page.click('[data-step-index="1"] select#month-select');

    await page.evaluate(() => { document.querySelector('[data-step-index="1"] select#month-select').selectedIndex = 1; });
  } catch ({ message = 'No error message is defined' }) {
    console.error(`Error in Step 1 - Enter Single Dates. ${message.trim()}`);
  }
};
