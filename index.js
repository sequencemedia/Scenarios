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

console.info(`Executing scenario '${scenario}' ...`);

execute(env)
  .then(() => {
    console.info(`Scenario '${scenario}' was successful.`);
    process.exit();
  })
  .catch(({ message = 'No error message is defined.' }) => {
    console.error(`Scenario ${scenario} has failed. ${message}`);
    process.exit(1);
  });
