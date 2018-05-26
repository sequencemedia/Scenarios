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

// const toCamelCase = (s = '') => s.toString().replace(/-([a-z])/g, ([index, match]) => match.toUpperCase());

const map = new Map(Object.entries(parser(process.argv.slice(2))));
const scenario = map.get('scenario');

if (!scenario) process.exit(1);

const {
  scenarios: {
    [scenario]: execute = () => {
      const reason = new Error(`No matching scenario for '${scenario}'`);

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

execute({ env, headless: !map.has('head') })
  .then(() => {
    console.info(`Scenario '${scenario}' has executed successfully.`);
    process.exit();
  })
  .catch(({ message = 'No error message is defined' }) => {
    console.error(`Scenario ${scenario} has not executed successfully. ${message}`.trim());
    process.exit(1);
  });
