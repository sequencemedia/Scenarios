/* eslint no-nested-ternary: "off", no-console: "off" */

require('babel-register');

const { args } = require('./lib/args');

const {
  PRODUCTION,
  STAGING,
  UAT,
  QA,
  DEV
} = require('./lib/environments');

const { scenarios } = require('./lib/scenarios');
const { profile } = require('./lib/profile');
const { address } = require('./lib/address');
const { contact } = require('./lib/contact');
const toBool = require('./lib/to-bool').default;

const scenario = args.get('scenario');

if (!scenario) process.exit(1);

const {
  [scenario]: execute = () => Promise.reject(new Error(`No matching scenario for '${scenario}'`))
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
  h
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
  const executeNonStop = (c, p, n = 1) => (
    execute(c, p)
      .then(() => {
        console.info(`\n[${n}] Scenario '${scenario}' has executed successfully - executing again ...\n`);
      })
      .catch(({ message = 'No error message is defined' }) => {
        console.error(`\n[${n}] Scenario ${scenario} has not executed successfully. ${message.trim()} - executing again ...\n`);
      })
      .then(() => executeNonStop(c, p, n + 1))
  );

  console.info(`Executing scenario '${scenario}' non-stop ...\n`);

  executeNonStop(config, params);
} else {
  const executeOnce = (c, p) => (
    execute(c, p)
      .then(() => {
        console.info(`\nScenario '${scenario}' has executed successfully.\n`);
      })
      .catch(({ message = 'No error message is defined' }) => {
        console.error(`\nScenario ${scenario} has not executed successfully. ${message.trim()}\n`);
      })
      .then(() => process.exit())
  );

  console.info(`Executing scenario '${scenario}' ...\n`);

  executeOnce(config, params);
}
