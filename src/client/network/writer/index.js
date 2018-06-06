import path from 'path';
import fs, { ensureFile } from 'fs-extra';

import Writer from 'csv-write-stream';

import { map } from 'app/client/network';
import getDir from 'app/get-dir';
import getNow from 'app/get-now';

// const isEmpty = (object = {}) => !!Reflect.ownKeys(object).length;

const isEmpty = (object = {}) => {
  for (let key in object) return false; // eslint-disable-line
  return true;
};

export default () => {
  const values = Array
    .from(map.values());

  const timestamps = values
    .reduce((accumulator, { timestamp }) => (
      accumulator.includes(timestamp)
        ? accumulator
        : accumulator.concat(timestamp)
    ), []);

  timestamps
    .forEach((timestamp) => {
      const scenarios = values
        .filter(({ timestamp: t }) => timestamp === t)
        .reduce((accumulator, { scenario }) => (
          accumulator.includes(scenario)
            ? accumulator
            : accumulator.concat(scenario)
        ), []);

      scenarios
        .forEach((scenario) => {
          const iterations = values
            .filter(({ timestamp: t, scenario: s }) => timestamp === t && scenario === s)
            .reduce((accumulator, { iteration }) => (
              accumulator.includes(iteration)
                ? accumulator
                : accumulator.concat(iteration)
            ), []);

          iterations
            .forEach(async (iteration) => {
              const f = `${getDir(iteration, scenario, getNow(timestamp))}/network.csv`;
              const p = path.resolve(f);

              await ensureFile(p);

              const writeStream = fs.createWriteStream(p);
              const writer = Writer({
                headers: [
                  'Index',
                  'Method',
                  'URL',
                  'Referer',
                  'Status',
                  'Status Text',
                  'Succeeded',
                  'Type',
                  'Error Text',
                  'Cancelled',
                  'Timestamp',
                  'Scenario',
                  'Iteration'
                ]
              });

              await new Promise((resolve, reject) => {
                writeStream
                  .on('close', resolve)
                  .on('error', reject);

                writer
                  .pipe(writeStream);

                values
                  .filter(({ timestamp: t, scenario: s, iteration: i }) => timestamp === t && scenario === s && iteration === i)
                  .forEach(({
                    request: {
                      method,
                      url,
                      headers: {
                        Referer: referer = ''
                      }
                    },
                    response: {
                      status,
                      statusText
                    } = {},
                    failed = {},
                    failed: {
                      type,
                      errorText,
                      canceled
                    } = {}
                  }, index) => {
                    writer.write([
                      index,
                      method,
                      url,
                      referer,
                      status,
                      statusText,
                      isEmpty(failed),
                      type,
                      errorText,
                      canceled,
                      timestamp,
                      scenario,
                      iteration
                    ]);
                  });

                writer.end();
              });
            });
        });
    });
};
