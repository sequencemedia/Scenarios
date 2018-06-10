import path from 'path';
import fs, { ensureFile } from 'fs-extra';

import Writer from 'csv-write-stream';

import { map } from 'app/client/network';
import getDir from 'app/get-dir';
import getNow from 'app/get-now';

const toValueOf = (string) => (new Date(string)).valueOf();

const isEmpty = (object = {}) => { // const isEmpty = (object = {}) => !!Reflect.ownKeys(object).length;
  for (let key in object) return false; // eslint-disable-line
  return true;
};

const getValues = () => Array.from(map.values());

const getTimestamps = (values) => (
  values
    .filter(({ timestamp }) => !!timestamp)
    .reduce((accumulator, { timestamp }) => (
      accumulator.includes(timestamp)
        ? accumulator
        : accumulator.concat(timestamp)
    ), [])
);

const getScenarios = (values, timestamp) => (
  values
    .filter(({ timestamp: t }) => timestamp === t)
    .reduce((accumulator, { scenario }) => (
      accumulator.includes(scenario)
        ? accumulator
        : accumulator.concat(scenario)
    ), [])
);

const getIterations = (values, timestamp, scenario) => (
  values
    .filter(({ timestamp: t, scenario: s }) => timestamp === t && scenario === s)
    .reduce((accumulator, { iteration }) => (
      accumulator.includes(iteration)
        ? accumulator
        : accumulator.concat(iteration)
    ), [])
);

const generateFrom = (values) => (
  Promise.all(getTimestamps(values)
    .map((timestamp) => (
      Promise.all(getScenarios(values, timestamp)
        .map((scenario) => (
          Promise.all(getIterations(values, timestamp, scenario)
            .map((iteration) => {
              const f = `${getDir(iteration, scenario, getNow(timestamp))}/network.csv`;
              const p = path.resolve(f);

              return ensureFile(p)
                .then(() => {
                  const writeStream = fs.createWriteStream(p);
                  const writer = Writer({
                    headers: [
                      'Index',
                      'Method',
                      'URL',
                      'Payload',
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

                  return new Promise((resolve, reject) => {
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
                          postData: payload = '',
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
                          payload,
                          referer,
                          status,
                          statusText,
                          isEmpty(failed),
                          type,
                          errorText,
                          canceled,
                          toValueOf(timestamp),
                          scenario,
                          iteration
                        ]);
                      });

                    writer.end();
                  });
                });
            }))
        )))
    )))
);

export default () => generateFrom(getValues());
