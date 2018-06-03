import puppeteer from 'puppeteer';

import path from 'path';
import chalk from 'chalk';
import moment from 'moment';
import { ensureDir } from 'fs-extra';

import Logger from 'app/logger';

import transformUrl from 'app/transform-url';

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
  iteration = 0
} = {}, params = {}) => {
  const now = moment(timestamp)
    .format('YYYYMMDD-HHmmss');
  const dir = path.resolve((iteration)
    ? `./log/${scenario}/${now}/${iteration}`
    : `./log/${scenario}/${now}`);

  const browser = await puppeteer.launch({
    headless,
    args: [
      `--window-size=${width},${height}`
    ]
  });

  const page = await browser.newPage();

  await page.setViewport({ width, height });

  await page.goto(`http://${env}/${lang}/quote`);

  /* BEGIN NETWORK MONITORING */

  const requestMap = new Map();

  const client = await page.target().createCDPSession();
  await client.send('Emulation.clearDeviceMetricsOverride');

  const getResponseBody = async (requestId) => {
    const { body } = await client.send('Network.getResponseBody', { requestId });
    return body;
  };

  const onNetworkRequestWillBeSent = (event = {}) => {
    const { request: { url, method } } = event;

    if (url.includes('omtrdc') && method === 'POST') {
      const { requestId, request } = event;

      requestMap.set(requestId, request);

      Logger.info(chalk.cyan('Network.requestWillBeSent'), '\n', {
        requestId,
        url: transformUrl(url),
        method
      });
    }
  };

  const onNetworkResponseReceived = ({
    requestId,
    response: {
      url,
      status,
      statusText
    }
  }) => {
    if (requestMap.has(requestId)) {
      Logger.info(chalk.cyan('Network.responseReceived'), '\n', {
        requestId,
        url: transformUrl(url),
        status,
        statusText
      });
    }
  };

  const onNetworkLoadingFailed = async ({ requestId, ...response } = {}) => { // Logger.info('Network.loadingFailed', { requestId, ...response });
    if (requestMap.has(requestId)) {
      Logger.info(chalk.red('Network.loadingFailed'), '\n', { ...response, requestId }, await getResponseBody(requestId));
      requestMap.delete(requestId);
    }
  };

  const onNetworkLoadingFinished = ({ requestId }) => { // , ...response }) => { // Logger.info('Network.loadingFinished', { requestId, ...response });
    if (requestMap.has(requestId)) {
      Logger.info(chalk.cyan('Network.loadingFinished'), '\n', { requestId });
      requestMap.delete(requestId);
    }
  };

  client.on('Network.requestWillBeSent', onNetworkRequestWillBeSent);

  client.on('Network.responseReceived', onNetworkResponseReceived);

  client.on('Network.loadingFailed', onNetworkLoadingFailed);

  client.on('Network.loadingFinished', onNetworkLoadingFinished);

  await client.send('Network.enable');

  /* END NETWORK MONITORING */

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
    await single(config, params);

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
    /* BEGIN NETWORK MONITORING */

    await client.send('Network.disable');

    client.removeListener('Network.requestWillBeSent', onNetworkRequestWillBeSent);

    client.removeListener('Network.responseReceived', onNetworkResponseReceived);

    client.removeListener('Network.loadingFailed', onNetworkLoadingFailed);

    client.removeListener('Network.loadingFinished', onNetworkLoadingFinished);

    /* END NETWORK MONITORING */

    await browser.close();
  }
};
