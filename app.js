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

const scenario = args.get('scenario');

if (!scenario) process.exit(1);

const {
  [scenario]: execute = () => {
    const reason = new Error(`No matching scenario for '${scenario}'`);

    return Promise.reject(reason);
  }
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

const headless = !args.has('head');
const w = args.get('w');
const h = args.get('h');

const selectPredictedCountry = args.get('selectPredictedCountry');
const selectBasic = args.get('selectBasic');
const selectBasicNonMedical = args.get('selectBasicNonMedical');
const selectBasicNonMedicalTripCancellation = args.get('selectBasicNonMedicalTripCancellation');
const selectOptIn = args.get('selectOptIn');
const selectAcceptConditions = args.get('selectAcceptConditions');

console.info(`Executing scenario '${scenario}' ...`);

execute({
  env,
  headless,
  w,
  h
}, {
  profile,
  address,
  contact,
  selectPredictedCountry,
  selectBasic,
  selectBasicNonMedical,
  selectBasicNonMedicalTripCancellation,
  selectOptIn,
  selectAcceptConditions
})
  .then(() => {
    console.info(`Scenario '${scenario}' has executed successfully.`);
    process.exit();
  })
  .catch(({ message = 'No error message is defined' }) => {
    console.error(`Scenario ${scenario} has not executed successfully. ${message}`.trim());
    process.exit(1);
  });
