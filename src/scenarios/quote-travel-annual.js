import puppeteer from 'puppeteer';

import { ensureDir } from 'fs-extra';

import getNow from 'app/get-now';
import getDir from 'app/get-dir';
import Logger from 'app/logger';

import network from 'app/client/network';

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

const step1 = async ({ page, ...config }, params = {}) => {
  try {
    await page.waitForSelector('[data-step-index="1"]', { visible: true });
    /*
     *  Weirdness
     */
    await page.click('[data-step-index="1"]');

    await enterAnnualDates({ ...config, page }, params);

    await enterProfile({ ...config, page }, params);

    await page.click('[data-step-index="1"] button.cta-button');
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Step 1. ${message.trim()}`);

    const {
      dir,
      w: width,
      h: height
    } = config;

    await ensureDir(dir);

    await page.screenshot({
      path: `${dir}/step-1.png`,
      fullPage: true,
      clip: {
        x: 0,
        y: 0,
        width,
        height
      }
    });
  }
};

export default async ({
  env,
  lang = 'en',
  headless = true,
  w: width = 1024,
  h: height = 768,
  scenario,
  timestamp = new Date(),
  iteration = 0,
  now = getNow(timestamp),
  dir = getDir(iteration, scenario, now),
  captureNetwork = false
} = {}, params = {}) => {
  const browser = await puppeteer.launch({
    headless,
    args: [
      `--window-size=${width},${height}`
    ]
  });

  const page = await browser.newPage();

  await page.setViewport({ width, height });

  const client = await page.target().createCDPSession();
  await client.send('Emulation.clearDeviceMetricsOverride');

  const {
    attach,
    detach
  } = network(client);

  const config = {
    browser,
    page,
    client,
    env,
    lang,
    headless,
    w: width,
    h: height,
    scenario,
    timestamp,
    iteration,
    now,
    dir
  };

  try {
    if (captureNetwork) await attach();

    await page.goto(`http://${env}/${lang}/quote`);

    await annual(config, params);

    await page.waitForNavigation();

    await step1(config, params);
    await step2(config, params);
    await step3(config, params);
    await step4(config, params);

    await page.waitForNavigation();

    await altapay(config, params);

    await page.waitForNavigation({ waitUntil: ['networkidle2', 'load'] });
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in scenario '${scenario}'. ${message.trim()}`);

    await ensureDir(dir);

    await page.screenshot({
      path: `${dir}/${scenario}.png`,
      fullPage: true,
      clip: {
        x: 0,
        y: 0,
        width,
        height
      }
    });
  } finally {
    await browser.close();

    if (captureNetwork) await detach();
  }
};
