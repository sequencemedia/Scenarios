
// import chalk from 'chalk';

import args from 'app/args';

import Logger from 'app/logger';
import toBool from 'app/to-bool';
// import format from 'app/format';

import networkWriter from 'app/client/network/writer';

const scenario = args.get('scenario');

export default (code = 0) => {
  let message;
  switch (code) {
    case 130:
      message = `Execution of scenario '${scenario}' has been stopped.`;
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

  const { stdout } = process;

  stdout.clearLine();
  stdout.cursorTo(0);

  if (code === 0 || code === 130) Logger.info(message);
  else Logger.error(message);

  if (toBool(args.get('captureNetwork'))) networkWriter();

  process.exitCode = (code === 1)
    ? 1
    : 0;
};
