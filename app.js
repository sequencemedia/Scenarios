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

const onExit = (code) => {
  let message;
  switch (code) {
    case 130:
      message = ` - Execution of scenario '${scenario}' has been stopped.`;
      break;
    case 1:
      message = 'Boom!';
      break;
    case 2:
      message = 'No scenario to execute.';
      break;
    case 3:
      message = `No matching scenario for '${scenario}'.`;
      break;
    default:
      message = `Execution of scenario '${scenario}' is complete.`;
      break;
  }
  if (code === 0) console.info(message);
  else console.error(message);

  process.exitCode = (code === 1)
    ? 1
    : 0;
};

process.once('exit', onExit);

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

const selectPredictedCountry = args.get('selectPredictedCountry');
const selectBasic = args.get('selectBasic');
const selectBasicNonMedical = args.get('selectBasicNonMedical');
const selectBasicNonMedicalTripCancellation = args.get('selectBasicNonMedicalTripCancellation');
const selectOptIn = args.get('selectOptIn');
const selectAcceptConditions = args.get('selectAcceptConditions');

const ONEH = 10 * 10; // eslint-disable-line
const ONEK = 10 * 10 * 10;
const ONEM = ONEK * ONEK;
const ONEB = ONEM * ONEK; // short scale (9 zeros)

/*
const format = (n) => (
  (n > ONEB)
    ? ' '.repeat((n / ONEB) < 10 ? 2 : (n / ONEB) < ONEH ? 1 : 0) + `${Math.floor(n / ONEB)}b`
    : (n > ONEM)
      ? ' '.repeat((n / ONEM) < 10 ? 2 : (n / ONEM) < ONEH ? 1 : 0) + `${Math.floor(n / ONEM)}m`
      : (n > ONEK)
        ? ' '.repeat((n / ONEK) < 10 ? 2 : (n / ONEK) < ONEK ? 1 : 0) + `${Math.floor(n / ONEK)}k`
        : ' '.repeat((n < 10) ? 3 : (n < 100) ? 2 : (n < 1000) ? 1 : 0) + n);
*/

const format = (n) => (n >= ONEB) ? `${n / ONEB}B` : (n >= ONEM) ? `${n / ONEM}M` : (n >= ONEK) ? `${n / ONEK}K` : n.toString();

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
        console.info(`\n\t${format(n)}`, `Scenario '${scenario}' has executed successfully - executing again ...\n`);
      })
      .catch(({ message = 'No error message is defined' }) => {
        console.error(`\n\t${format(n)}`, `Scenario ${scenario} has not executed successfully. ${message.trim()} - executing again ...\n`);
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

