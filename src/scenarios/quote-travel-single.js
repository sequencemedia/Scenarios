import puppeteer from 'puppeteer';

import captureScreenshot from 'app/capture-screenshot';
import getNow from 'app/get-now';
import getDir from 'app/get-dir';
import Logger from 'app/logger';

import network, { map as networkMap } from 'app/client/network';
import networkWriter from 'app/client/network/writer';

import {
  single,
  step2 as Step2,
  step3 as Step3,
  step4 as Step4,
  altapay
} from './travel';

const { step2 } = Step2;
const { step3 } = Step3;
const { step4 } = Step4;

import enterSingleDates from './travel/step1/step1-enter-single-dates';
import enterProfile from './travel/step1/step1-enter-profile';

const step1 = async ({ page, ...config }, params = {}) => {
  try {
    await page.waitForSelector('[data-step-index="1"]', { visible: true });
    /*
     *  Weirdness
     */
    await page.click('[data-step-index="1"]');

    await enterSingleDates({ ...config, page }, params);

    await enterProfile({ ...config, page }, params);

    await page.click('[data-step-index="1"] button.cta-button');
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in Step 1. ${message.trim()}`);

    await captureScreenshot({ ...config, page }, 'step-1');
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

  let networkEvents;

  try {
    networkMap.clear();

    if (captureNetwork) {
      networkEvents = network(config);
      await networkEvents.attach();
    }

    await page.goto(`https://${env}/${lang}/quote`, { waitUntil: ['networkidle2', 'load'] });

    await single(config, params);

    await step1(config, params);
    await step2(config, params);
    await step3(config, params);
    await step4(config, params);

    await altapay(config, params);

    await captureScreenshot(config, 'step-4-confirmation');
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error in scenario '${scenario}'. ${message.trim()}`);

    await captureScreenshot(config, scenario);
  } finally {
    if (captureNetwork) {
      await networkEvents.detach();
      await networkWriter();
    }
  }

  try {
    await browser.close();
  } catch ({ message = 'No error message is defined' }) {
    Logger.error(`Error calling 'browser.close()' in '${scenario}'. ${message.trim()}`);

    await captureScreenshot(config, scenario);
  }
};
