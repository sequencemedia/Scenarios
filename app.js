/* eslint no-nested-ternary: "off" */

import chalk from 'chalk';

import {
  PRODUCTION,
  STAGING,
  UAT,
  QA,
  DEV
} from 'app/environments';

import args from 'app/args';

import onExit from 'app/on-exit';
import scenarios from 'app/scenarios';
import profile from 'app/profile';
import address from 'app/address';
import contact from 'app/contact';
import toBool from 'app/to-bool';
import format from 'app/format';
import Logger from 'app/logger';

process.once('exit', onExit);

const scenario = args.get('scenario');

if (!scenario) process.exit(2);

if (!Reflect.has(scenarios, scenario)) process.exit(3);

const {
  [scenario]: execute = () => Promise.resolve()
} = scenarios;

const env = (
  args.has('url')
    ? args.get('url')
    : args.has('production')
      ? PRODUCTION
      : args.has('staging')
        ? STAGING
        : args.has('uat')
          ? UAT
          : args.has('qa')
            ? QA
            : DEV
);

const maximum = Number(args.get('maximum'));
const nonStop = toBool(args.get('nonStop'));
const headless = !toBool(args.has('head'));
const captureNetwork = toBool(args.get('captureNetwork'));

const config = {
  env,
  headless,
  ...(args.has('w') ? { w: args.get('w') } : {}),
  ...(args.has('h') ? { h: args.get('h') } : {}),
  scenario,
  timestamp: new Date(),
  captureNetwork
};

const params = {
  profile,
  address,
  contact,
  ...(args.has('selectPredictedCountry') ? { selectPredictedCountry: args.get('selectPredictedCountry') } : {}),
  ...(args.has('selectBasic') ? { selectBasic: args.get('selectBasic') } : {}),
  ...(args.has('selectBasicNonMedical') ? { selectBasicNonMedical: args.get('selectBasicNonMedical') } : {}),
  ...(args.has('selectBasicNonMedicalTripCancellation') ? { selectBasicNonMedicalTripCancellation: args.get('selectBasicNonMedicalTripCancellation') } : {}),
  ...(args.has('selectOptIn') ? { selectOptIn: args.get('selectOptIn') } : {}),
  ...(args.has('selectAcceptConditions') ? { selectAcceptConditions: args.get('selectAcceptConditions') } : {}),
  ...(args.has('applyCampaignCode') ? { applyCampaignCode: args.get('applyCampaignCode') } : {}),
  ...(args.has('applyBupaMember') ? { applyBupaMember: args.get('applyBupaMember') } : {}),
  ...(args.has('applyBrokerCode') ? { applyBrokerCode: args.get('applyBrokerCode') } : {}),
  ...(args.has('campaignCode') ? { applyCampaignCode: args.get('campaignCode') } : {}),
  ...(args.has('bupaMember') ? { applyBupaMember: args.get('bupaMember') } : {}),
  ...(args.has('brokerCode') ? { applyBrokerCode: args.get('brokerCode') } : {})
};

if (maximum) {
  const executeMaximum = ({ iteration, ...c }, p) => (
    execute({ ...c, iteration }, p)
      .then(() => {
        Logger.info('\t', chalk.yellow(format(iteration)), (iteration < maximum) ? `Scenario '${scenario}' has executed successfully - executing again ...` : `Scenario '${scenario}' has executed successfully.`);
      })
      .catch(({ message = 'No error message is defined' }) => {
        Logger.error('\t', chalk.yellow(format(iteration)), `Scenario '${scenario}' has not executed successfully. ${message.trim()} - executing again ...`);
      })
      .then(() => (iteration < maximum) ? executeMaximum({ ...c, iteration: iteration + 1 }, p) : process.exit())
  );

  Logger.info((maximum === 1) ? `Executing scenario '${scenario}' for 1 iteration ...` : `Executing scenario '${scenario}' for ${maximum} iterations ...`);

  executeMaximum({ ...config, iteration: 1 }, params);
} else if (nonStop) {
  const executeNonStop = ({ iteration, ...c }, p) => (
    execute({ ...c, iteration }, p)
      .then(() => {
        Logger.info('\t', chalk.yellow(format(iteration)), `Scenario '${scenario}' has executed successfully - executing again ...`);
      })
      .catch(({ message = 'No error message is defined' }) => {
        Logger.error('\t', chalk.yellow(format(iteration)), `Scenario '${scenario}' has not executed successfully. ${message.trim()} - executing again ...`);
      })
      .then(() => executeNonStop({ ...c, iteration: iteration + 1 }, p))
  );

  Logger.info(`Executing scenario '${scenario}' non-stop ...`);

  executeNonStop({ ...config, iteration: 1 }, params);
} else {
  const executeOnce = (c, p) => (
    execute(c, p)
      .then(() => {
        Logger.info(`Scenario '${scenario}' has executed successfully.`);
      })
      .catch(({ message = 'No error message is defined' }) => {
        Logger.error(`Scenario '${scenario}' has not executed successfully. ${message.trim()}`);
      })
      .then(() => process.exit())
  );

  Logger.info(`Executing scenario '${scenario}' ...`);

  executeOnce(config, params);
}

