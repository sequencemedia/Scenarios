/* eslint no-nested-ternary: "off" */

import querystring from 'querystring';
import * as URI from 'uri-js';
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

const dateAsc = ({ Timestamp: alpha } = {}, { Timestamp: omega } = {}) => (alpha > omega) ? +1 : (alpha < omega) ? -1 : 0;
const dateDsc = ({ Timestamp: alpha } = {}, { Timestamp: omega } = {}) => (alpha > omega) ? -1 : (alpha < omega) ? +1 : 0;

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
        filePath: `./report/${getNow()}/${index + 1}.txt`,
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

function getHost (url) {
  const { host } = URI.parse(url);

  return host;
}

function getPath (url) {
  const { path } = URI.parse(url);

  return path;
}


const generateAll = (filePathList) => (
  readAllCSVs(filePathList)
    .then(createJSONDataListFromCSVs)
    .then((array) => {
      const values = array
        .reduce((accumulator, rows) => accumulator.concat(rows), [])
        .sort(dateAsc);

      const urls = values
        .reduce((accumulator, { URL: url }) => (accumulator.includes(getHost(url))) ? accumulator : accumulator.concat(getHost(url)), []);

      const referers = values
        .reduce((accumulator, { Referer: referer }) => (accumulator.includes(referer)) ? accumulator : accumulator.concat(referer), []);

      const methods = values
        .reduce((accumulator, { Method: method }) => (accumulator.includes(method)) ? accumulator : accumulator.concat(method), []);

      console.log('URL');

      urls
        .map((url) => values.filter(({ URL: u }) => u.includes(url)))
        .forEach((collection) => {
          console.log(collection.length);
        });

      console.log('Referer');

      referers
        .map((referer) => values.filter(({ Referer: r }) => referer === r))
        .forEach((collection) => {
          console.log(collection.length);
        });

      console.log('Method');

      methods
        .map((method) => values.filter(({ Method: m }) => method === m))
        .forEach((collection) => {
          console.log(collection.length);
        });
    })
    .catch(({ message = 'No error message defined' }) => {
      Logger.error(message);
      process.exit(2);
    })
);

glob(`${artifacts}/**/*.csv`, async (e, filePathList) => await (!e) ? generateAll(filePathList.map((filePath) => ({ filePath }))) : e);

