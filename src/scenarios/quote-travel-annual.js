import puppeteer from 'puppeteer';

import {
  step2,
  step3,
  step4,
  altapay
} from './travel';

const annual = async (page) => {
  await page.focus('button[data-cover-type="travel"]');
  await page.click('button[data-cover-type="travel"]');

  await page.waitForSelector('.quote-input-container');
  await page.evaluate(() => { document.querySelector('.quote-input-container').scrollIntoView({ behaviour: 'instant' }); });
  await page.waitForSelector('.quote-input-container', { visible: true });

  await page.focus('button[data-cover-period="annual"]');
  await page.click('button[data-cover-period="annual"]');

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

  await page.waitForSelector('[data-step-index="1"] .annual-insurance-period');
  await page.evaluate(() => { document.querySelector('[data-step-index="1"] .annual-insurance-period').scrollIntoView({ behaviour: 'instant' }); });
  await page.waitForSelector('[data-step-index="1"] .annual-insurance-period', { visible: true });

  await page.focus('[data-step-index="1"] select#month-select');
  await page.click('[data-step-index="1"] select#month-select');

  await page.evaluate(() => { document.querySelector('[data-step-index="1"] select#month-select').selectedIndex = 1; });

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

export default async ({ env, lang = 'en', headless = true }) => {
  const browser = await puppeteer.launch({ headless });
  const page = await browser.newPage();

  await page.goto(`http://${env}/${lang}/quote`);

  await annual(page);

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
