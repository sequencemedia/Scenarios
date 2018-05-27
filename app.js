/* eslint no-nested-ternary: "off", no-console: "off" */

require('babel-register');

const parser = require('yargs-parser');

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

const map = new Map(Object.entries(parser(process.argv.slice(2))));
const scenario = map.get('scenario');

if (!scenario) process.exit(1);

const {
  [scenario]: execute = () => {
    const reason = new Error(`No matching scenario for '${scenario}'`);

    return Promise.reject(reason);
  }
} = scenarios;

const env = (
  map.has('production')
    ? PRODUCTION
    : map.has('staging')
      ? STAGING
      : map.has('uat')
        ? UAT
        : map.has('qa')
          ? QA
          : DEV
);

const headless = !map.has('head');

const selectBasic = map.get('selectBasic');
const selectBasicNonMedical = map.get('selectBasicNonMedical');
const selectBasicNonMedicalTripCancellation = map.get('selectBasicNonMedicalTripCancellation');
const selectOptIn = map.get('selectOptIn');
const selectAcceptConditions = map.get('selectAcceptConditions');

console.info(`Executing scenario '${scenario}' ...`);

execute({ env, headless }, {
  profile,
  address,
  contact,
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
