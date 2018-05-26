import puppeteer from 'puppeteer';

const single = async (page) => {
  await page.focus('button[data-cover-type="travel"]');
  await page.click('button[data-cover-type="travel"]');

  await page.waitForSelector('.quote-input-container');
  await page.evaluate(() => { document.querySelector('.quote-input-container').scrollIntoView({ behaviour: 'instant' }); });
  await page.waitForSelector('.quote-input-container', { visible: true });

  await page.focus('button[data-cover-period="single"]');
  await page.click('button[data-cover-period="single"]');

  await page.waitForSelector('.quote-input-country-container input.quote-input-country');

  const countries = await page.$$('.quote-input-country-container input.quote-input-country');
  countries
    .forEach(async (country) => {
      await country.focus();
      await country.click();
      await country.type('United Kingdom');
    });

  await page.waitForSelector('.quote-continue');
  await page.evaluate(() => { document.querySelector('.quote-continue').scrollIntoView({ behaviour: 'instant' }); });
  await page.waitForSelector('.quote-continue', { visible: true });

  await page.focus('button[data-tracking="click:quote:step-0:cta:continue"]');
  await page.click('button[data-tracking="click:quote:step-0:cta:continue"]');
};

const step1 = async (page) => {
  await page.waitForSelector('[data-step-index="1"]', { visible: true });
  /*
   *  Weirdness
   */
  await page.click('[data-step-index="1"]');

  await page.waitForSelector('[data-step-index="1"] .single-insurance-period');
  await page.evaluate(() => { document.querySelector('[data-step-index="1"] .single-insurance-period').scrollIntoView({ behaviour: 'instant' }); });
  await page.waitForSelector('[data-step-index="1"] .single-insurance-period', { visible: true });

  await page.focus('[data-step-index="1"] input#startdate');
  await page.click('[data-step-index="1"] input#startdate');

  await page.waitForSelector('.datepicker', { visible: true });

  await page.click('.datepicker .day:not(.disabled)');

  await page.focus('[data-step-index="1"] input#finishdate');
  await page.click('[data-step-index="1"] input#finishdate');

  await page.waitForSelector('.datepicker', { visible: true });

  await page.click('.datepicker .day:not(.disabled)');

  await page.waitForSelector('[data-step-index="1"] .about-members');
  await page.evaluate(() => { document.querySelector('[data-step-index="1"] .about-members').scrollIntoView({ behaviour: 'instant' }); });
  await page.waitForSelector('[data-step-index="1"] .about-members', { visible: true });

  await page.type('[data-step-index="1"] select#business-title', 'Mr');
  await page.type('[data-step-index="1"] input#first-name', 'Jonathan');
  await page.type('[data-step-index="1"] input#last-name', 'Perry');
  await page.type('[data-step-index="1"] input#date-day', '15');
  await page.type('[data-step-index="1"] input#date-month', '10');
  await page.type('[data-step-index="1"] input#date-year', '1973');

  await page.click('[data-step-index="1"] button.cta-button');
};

const step2 = async (page) => {
  await page.waitForSelector('[data-step-index="2"]', { visible: true });
  /*
   *  Weirdness
   */
  await page.click('[data-step-index="2"]');

  await page.evaluate(() => { document.querySelector('[data-step-index="2"] .your-quote-wrapper').scrollIntoView({ behaviour: 'instant' }); });
  await page.waitForSelector('[data-step-index="2"] .your-quote-wrapper', { visible: true });

  await page.click('[data-step-index="2"] button.buy-cta');
};

const step3 = async (page) => {
  await page.waitForSelector('[data-step-index="3"]', { visible: true });
  /*
   *  Weirdness
   */
  await page.click('[data-step-index="3"]');

  await page.evaluate(() => { document.querySelector('[data-step-index="3"] .proceed-to-checkout').scrollIntoView({ behaviour: 'instant' }); });
  await page.waitForSelector('[data-step-index="3"] .proceed-to-checkout', { visible: true });

  await page.click('[data-step-index="3"] [data-tracking="cta:click:continue-to-checkout"] button.quote-cta-next');
};

const step4 = async (page) => {
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

const altapay = async (page) => {
  await page.waitForSelector('section.altapay-main-container');
  await page.type('#creditCardNumberInput', '4444444444444444');
  await page.type('#cvcInput', '123');

  await page.evaluate(() => { document.querySelector('input[type="submit"]').scrollIntoView({ behaviour: 'instant' }); });
  await page.click('input[type="submit"]');
};

export default async ({ env, lang = 'en' }) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`http://${env}/${lang}/quote`);

  await single(page);

  await page.waitForNavigation();

  await step1(page);
  await step2(page);
  await step3(page);
  await step4(page);

  await page.waitForNavigation();

  await altapay(page);

  await page.waitForNavigation();

  await browser.close();
};
