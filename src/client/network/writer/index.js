// import path from 'path';
// import fs from 'fs-extra';
// import chalk from 'chalk';

// import Writer from 'csv-stream-writer';

import { map } from 'app/client/network';
// import getDir from 'app/get-dir';
// import getNow from 'app/get-now';
import Logger from 'app/logger';

// import headers from './headers';

// const writer = Writer({ headers });

export default () => {
  const array = Array
    .from(map.values())
    .reduce((accumulator, { timestamp }) => (accumulator.includes(timestamp) ? accumulator : accumulator.concat(timestamp)), []);

  Logger.info(array);

  /*
  const f = `${getDir(iteration, scenario, timestamp)}/${getNow(timestamp)} Network.csv`;
  const p = path.resolve(f);
  if (fs.pathExistsSync(p)) return writer;
  const w = fs.createWriteStream(p);
  return writer
    .pipe((
      w
        .on('close', () => {
          Logger.info(chalk.cyan('[close]'), f);
        })
        .on('error', (e) => {
          Logger.error(e);
        })
    ));
  */
};
