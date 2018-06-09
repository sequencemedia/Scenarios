import querystring from 'querystring';
import csv from 'csvtojson';
import glob from 'glob-all';
import { ensureFile } from 'fs-extra';
import {
  readFile,
  writeFile
} from 'sacred-fs';

import Logger from 'app/logger';
import artifacts from 'app/artifacts';
import getNow from 'app/get-now';

const convertBufferToString = (b) => b.toString('utf8');

const decode = (values) => values.split('&').map((value) => value.split('=').join('\t')).join('\n').trim();

const filterFile = ({ Referer: referer, URL: url }) => referer.includes('quote/travel/policy') && (url.includes('omtrdc') && !url.includes('mbox'));
const reduceFile = (accumulator = [], file = []) => {
  const rows = file.filter(filterFile);

  return (rows.length)
    ? accumulator.concat([rows])
    : accumulator;
};

const reduceRows = (accumulator = [], rows = [], index = 0) => (
  (rows.length)
    ? accumulator
      .concat({
        filePath: `./concatenate/${getNow()}/${index + 1}.txt`,
        fileData: rows.map((row) => {
          const {
            Method: method,
            URL: url,
            Payload: payload,
            Timestamp: timestamp,
            Scenario: scenario,
            Iteration: iteration
          } = row;

          const length = (method === 'GET') // eslint-disable-line
            ? url.substring(url.indexOf('?') + 1).length
            : (method === 'POST')
              ? payload.length
              : 0;

          const values = (method === 'GET') // eslint-disable-line
            ? querystring.unescape(url.substring(url.indexOf('?') + 1))
            : (method === 'POST')
              ? querystring.unescape(payload)
              : '';

          return (`
=====================
${method}
=====================
TIMESTAMP\t${getNow(new Date(timestamp))}
SCENARIO\t${scenario}
ITERATION\t${iteration}
=====================

LENGTH ${length}

${decode(values)}`).trim();
        }).join('\n\n').trim()
      })
    : accumulator
);

const readAllCSVs = (filePathList) => Promise.all(filePathList.map(({ filePath }) => readFile(filePath)));
const writeAllCSVs = (fileDataList) => Promise.all(fileDataList.map(({ filePath, fileData }) => ensureFile(filePath).then(() => writeFile(filePath, fileData))));

const createJSONDataListFromCSVs = (a) => Promise.all(a.map((b) => csv().fromString(convertBufferToString(b))));
const createFileDataListFromJSON = (a) => a.reduce(reduceFile, []).reduce(reduceRows, []);

const generateAllTXTs = (filePathList) => (
  readAllCSVs(filePathList)
    .then(createJSONDataListFromCSVs)
    .then(createFileDataListFromJSON)
    .then((fileDataList) => writeAllCSVs(fileDataList))
    .catch((reason) => {
      Logger.error(reason);
      process.exit(2);
    })
);

glob(`${artifacts}/**/*.csv`, async (e, filePathList) => await (e) ? process.exit(1) : generateAllTXTs(filePathList.map((filePath) => ({ filePath }))));
