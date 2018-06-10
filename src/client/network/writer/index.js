import path from 'path';
import fs, { ensureFile } from 'fs-extra';
import moment from 'moment';

import Writer from 'csv-write-stream';

import { map } from 'app/client/network';
import getDir from 'app/get-dir';
import getNow from 'app/get-now';

// const toValueOf = (value = '') => Date.parse(value); // Number(new Date(value)); // (new Date(value)).valueOf()

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

const getCSV = (iteration, scenario, timestamp) => path.resolve(`${getDir(iteration, scenario, getNow(timestamp))}/network.csv`);

const generateFrom = (values) => (
  Promise.all(getTimestamps(values)
    .map((timestamp) => (
      Promise.all(getScenarios(values, timestamp)
        .map((scenario) => (
          Promise.all(getIterations(values, timestamp, scenario)
            .map((iteration) => (
              ensureFile(getCSV(iteration, scenario, timestamp))
                .then(() => (
                  new Promise((resolve, reject) => {
                    const writeStream = fs.createWriteStream(getCSV(iteration, scenario, timestamp));
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
                        'Date/Time',
                        'Timestamp',
                        'Scenario',
                        'Iteration'
                      ]
                    });

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
                          moment(timestamp).format('Do MMMM YYYY, h:mm:ss a'),
                          Date.parse(timestamp),
                          scenario,
                          iteration
                        ]);
                      });

                    writer.end();
                  })
                ))
            )))
        )))
    )))
);

export default () => generateFrom(getValues());
