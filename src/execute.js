import chalk from 'chalk';

import scenarios from 'app/scenarios';
import format from 'app/format';
import Logger from 'app/logger';

/*
const {
  [scenario]: execute = () => Promise.resolve()
} = scenarios;
*/

const get = (scenario) => (scenarios[scenario] || (() => Promise.resolve()));

export const executeMaximum = ({
  scenario, iteration = 1, maximum = 1, ...c
}, p) => (
  get(scenario)({
    ...c, scenario, iteration, maximum
  }, p)
    .then(() => {
      Logger.info('\t', chalk.yellow(format(iteration)), (iteration < maximum) ? `Scenario '${scenario}' has executed successfully - executing again ...` : `Scenario '${scenario}' has executed successfully.`);
    })
    .catch(({ message = 'No error message is defined' }) => {
      Logger.error('\t', chalk.yellow(format(iteration)), `Scenario '${scenario}' has not executed successfully. ${message.trim()} - executing again ...`);
    })
    .then(() => (iteration < maximum) ? executeMaximum({
      ...c, iteration: iteration + 1, scenario, maximum
    }, p) : process.exit())
);

export const executeNonStop = ({ scenario, iteration = 1, ...c }, p) => (
  get(scenario)({ ...c, scenario, iteration }, p)
    .then(() => {
      Logger.info('\t', chalk.yellow(format(iteration)), `Scenario '${scenario}' has executed successfully - executing again ...`);
    })
    .catch(({ message = 'No error message is defined' }) => {
      Logger.error('\t', chalk.yellow(format(iteration)), `Scenario '${scenario}' has not executed successfully. ${message.trim()} - executing again ...`);
    })
    .then(() => executeNonStop({ ...c, iteration: iteration + 1, scenario }, p))
);

export const executeMinimum = ({ scenario, ...c }, p) => (
  get(scenario)({ ...c, scenario }, p)
    .then(() => {
      Logger.info(`Scenario '${scenario}' has executed successfully.`);
    })
    .catch(({ message = 'No error message is defined' }) => {
      Logger.error(`Scenario '${scenario}' has not executed successfully. ${message.trim()}`);
    })
    .then(() => process.exit())
);
