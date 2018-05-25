/* eslint no-nested-ternary: "off", no-console: "off" */

require('babel-register');

const parser = require('yargs-parser');

const {
  PRODUCTION,
  STAGING,
  UAT,
  QA,
  DEV
} = require('./src/environments');
const scenarios = require('./src/scenarios');

const map = new Map(Object.entries(parser(process.argv.slice(2))));
const scenario = map.get('scenario');

if (!scenario) process.exit(1);

const {
  scenarios: {
    [scenario]: execute = () => {
      const reason = new Error(`No matching scenario for '${scenario}'.`);

      return Promise.reject(reason);
    }
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

Promise.resolve()
  .then(() => {
    console.info(`Executing scenario '${scenario}' ...`);
  })
  .then(() => execute(env))
  .then(() => {
    console.info(`Scenario '${scenario}' is complete.`);
    process.exit();
  })
  .catch(({ message = 'No error message defined.' } = {}) => {
    console.error(message);
    process.exit(1);
  });
