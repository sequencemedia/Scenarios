import puppeteer from 'puppeteer';

import {
  annual,
  step2 as Step2,
  step3 as Step3,
  step4 as Step4,
  altapay
} from './travel';

const { step2 } = Step2;
const { step3 } = Step3;
const { step4 } = Step4;

import enterAnnualDates from './travel/step1/step1-enter-annual-dates';
import enterProfile from './travel/step1/step1-enter-profile';

const step1 = async (page, params = {}) => {
  await page.waitForSelector('[data-step-index="1"]', { visible: true });
  /*
   *  Weirdness
   */
  await page.click('[data-step-index="1"]');

  await enterAnnualDates(page, params);

  await enterProfile(page, params);

  await page.click('[data-step-index="1"] button.cta-button');
};

export default async ({
  env,
  lang = 'en',
  headless = true,
  w: width = 1024,
  h: height = 768
} = {}, params = {}) => {
  const browser = await puppeteer.launch({
    headless,
    args: [
      `--window-size=${width},${height}`
    ]
  });
  const page = await browser.newPage();

  await page.setViewport({ width, height });

  await page.goto(`http://${env}/${lang}/quote`);

  await annual(page, params);

  await page.waitForNavigation();

  await step1(page, params);
  await step2(page, params);
  await step3(page, params);
  await step4(page, params);

  await page.waitForNavigation();

  await altapay(page, params);

  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  await browser.close();
};
