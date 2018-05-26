export default async (page, {
  address: {
    address1 = '4 Callisons Place',
    address2 = 'Bellot Street',
    city = 'Greenwich',
    zip = 'SE10 0AJ'
  } = {},
  email = 'jonathan.perry@valtech.co.uk'
} = {}) => {
  await page.waitForSelector('[data-step-index="4"]', { visible: true });
  /*
   *  Weirdness
   */
  await page.click('[data-step-index="4"]');

  await page.evaluate(() => { document.querySelector('[data-step-index="4"] .address-details .row').scrollIntoView({ behaviour: 'instant' }); });

  await page.type('[data-step-index="4"] input#address_1', address1);
  await page.type('[data-step-index="4"] input#address_2', address2);
  await page.type('[data-step-index="4"] input#address_city', city);
  await page.type('[data-step-index="4"] input#address_zip', zip);

  await page.evaluate(() => { document.querySelector('[data-step-index="4"] .address-email .email-block').scrollIntoView({ behaviour: 'instant' }); });

  await page.type('[data-step-index="4"] input.email-address-js', email);
  await page.type('[data-step-index="4"] input.confirm-email-address-js', email);

  /*
   *  There's some more weirdness with this fake checkbox/button combination
   */

  await page.click('[data-step-index="4"] .marketing-opt-in');
  await page.evaluate(() => { document.querySelector('[data-step-index="4"] .marketing-opt-in .tickbox-input').scrollIntoView({ behaviour: 'instant' }); });

  await page.focus('[data-step-index="4"] .marketing-opt-in .tickbox-input');
  await page.click('[data-step-index="4"] .marketing-opt-in .tickbox-input');

  await page.click('[data-step-index="4"] .accept-conditions');
  await page.evaluate(() => { document.querySelector('[data-step-index="4"] .accept-conditions .tickbox-input').scrollIntoView({ behaviour: 'instant' }); });

  await page.focus('[data-step-index="4"] .accept-conditions .tickbox-input');
  await page.click('[data-step-index="4"] .accept-conditions .tickbox-input');

  await page.click('[data-step-index="4"] .accept-conditions');
  await page.evaluate(() => { document.querySelector('[data-step-index="4"] .accept-conditions .buy-btn a').scrollIntoView({ behaviour: 'instant' }); });

  await page.focus('[data-step-index="4"] .accept-conditions .buy-btn a');
  await page.click('[data-step-index="4"] .accept-conditions .buy-btn a');
};
