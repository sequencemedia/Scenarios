export default async (page) => {
  await page.waitForSelector('[data-step-index="4"]', { visible: true });
  /*
   *  Weirdness
   */
  await page.click('[data-step-index="4"]');

  await page.evaluate(() => { document.querySelector('[data-step-index="4"] .address-details .row').scrollIntoView({ behaviour: 'instant' }); });
  await page.waitForSelector('[data-step-index="4"] .address-details .row', { visible: true });

  await page.type('[data-step-index="4"] input#address_1', '4 Callisons Place');
  await page.type('[data-step-index="4"] input#address_2', 'Bellot Street');
  await page.type('[data-step-index="4"] input#address_city', 'Greenwich');
  await page.type('[data-step-index="4"] input#address_zip', 'SE10 0AJ');

  await page.evaluate(() => { document.querySelector('[data-step-index="4"] .address-email .email-block').scrollIntoView({ behaviour: 'instant' }); });
  await page.waitForSelector('[data-step-index="4"] .address-email .email-block', { visible: true });

  await page.type('[data-step-index="4"] input.email-address-js', 'jonathan.perry@valtech.co.uk');
  await page.type('[data-step-index="4"] input.confirm-email-address-js', 'jonathan.perry@valtech.co.uk');

  /*
   *  There's some more weirdness with this fake checkbox/button combination
   */

  await page.click('[data-step-index="4"] .accept-conditions');
  await page.evaluate(() => { document.querySelector('[data-step-index="4"] .accept-conditions .tickbox-input').scrollIntoView({ behaviour: 'instant' }); });

  await page.focus('[data-step-index="4"] .accept-conditions .tickbox-input');
  await page.click('[data-step-index="4"] .accept-conditions .tickbox-input');

  await page.click('[data-step-index="4"] .accept-conditions');
  await page.evaluate(() => { document.querySelector('[data-step-index="4"] .accept-conditions .buy-btn a').scrollIntoView({ behaviour: 'instant' }); });

  await page.focus('[data-step-index="4"] .accept-conditions .buy-btn a');
  await page.click('[data-step-index="4"] .accept-conditions .buy-btn a');
};
