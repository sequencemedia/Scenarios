/* eslint no-nested-ternary: "off" */

require('babel-register');

const chalk = require('chalk');

const {
  PRODUCTION,
  STAGING,
  UAT,
  QA,
  DEV
} = require('./lib/environments');

const args = require('./lib/args').default;

const onExit = require('./lib/on-exit').default;
const scenarios = require('./lib/scenarios').default;
const profile = require('./lib/profile').default;
const address = require('./lib/address').default;
const contact = require('./lib/contact').default;
const toBool = require('./lib/to-bool').default;
const format = require('./lib/format').default;
const Logger = require('./lib/logger').default;

process.once('exit', onExit);

const scenario = args.get('scenario');

if (!scenario) process.exit(2);

if (!Reflect.has(scenarios, scenario)) process.exit(3);

const {
  [scenario]: execute = () => Promise.resolve()
} = scenarios;

const env = (
  args.has('production')
    ? PRODUCTION
    : args.has('staging')
      ? STAGING
      : args.has('uat')
        ? UAT
        : args.has('qa')
          ? QA
          : DEV
);

const nonStop = toBool(args.get('nonStop'));
const headless = !toBool(args.has('head'));
const w = args.get('w');
const h = args.get('h');
const captureNetwork = toBool(args.get('captureNetwork'));

const selectPredictedCountry = args.get('selectPredictedCountry');
const selectBasic = args.get('selectBasic');
const selectBasicNonMedical = args.get('selectBasicNonMedical');
const selectBasicNonMedicalTripCancellation = args.get('selectBasicNonMedicalTripCancellation');
const selectOptIn = args.get('selectOptIn');
const selectAcceptConditions = args.get('selectAcceptConditions');

const config = {
  env,
  headless,
  w,
  h,
  scenario,
  timestamp: new Date(),
  captureNetwork
};

const params = {
  profile,
  address,
  contact,
  selectPredictedCountry,
  selectBasic,
  selectBasicNonMedical,
  selectBasicNonMedicalTripCancellation,
  selectOptIn,
  selectAcceptConditions
};

if (nonStop) {
  const executeNonStop = ({ iteration, ...c }, p) => (
    execute({ ...c, iteration }, p)
      .then(() => {
        Logger.info('\t', chalk.yellow(format(iteration)), `Scenario '${scenario}' has executed successfully - executing again ...`);
      })
      .catch(({ message = 'No error message is defined' }) => {
        Logger.error('\t', chalk.yellow(format(iteration)), `Scenario ${scenario} has not executed successfully. ${message.trim()} - executing again ...`);
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
        Logger.error(`Scenario ${scenario} has not executed successfully. ${message.trim()}`);
      })
      .then(() => process.exit())
  );

  Logger.info(`Executing scenario '${scenario}' ...`);

  executeOnce(config, params);
}

