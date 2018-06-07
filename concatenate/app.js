import glob from 'glob-all';
import { ensureFile } from 'fs-extra';
import {
  readFile,
  writeFile
} from 'sacred-fs';

import Logger from 'app/logger';
import artifacts from 'app/artifacts';
import getNow from 'app/get-now';

const convertStringToArray = (s) => s.split('\n');
const convertArrayToString = (a) => a.join('\n');

const convertBufferToString = (b) => b.toString('utf8');

const normalizeFile = (string) => {
  let s = string.trim();
  while (/\n\n/.test(s)) s = s.replace(/\n\n/g, '\n');
  return s.trim();
};

const normalizeLine = (string) => {
  let s = string.trim();
  while (/^,/.test(s)) s = s.replace(/^,/g, '');
  return s.trim();
};

const transformFromBuffer = (buffer) => convertStringToArray(normalizeFile(convertBufferToString(buffer)));
const transformToString = (array) => (
  convertArrayToString((
    array.reduce((accumulator, current) => {
      const c = normalizeLine(current);

      return (c)
        ? accumulator.concat(c)
        : accumulator;
    }, [])))
);

const mapFilePathList = (filePathList) => Promise.all(filePathList.map((f) => readFile(f)));
const writeCancatenatedCSV = (filePath, fileData) => writeFile(filePath, fileData);

const concatenate = ([head, ...body]) => {
  const h = head.trim();

  return (
    [head].concat((
      body.reduce((accumulator, current) => {
        const c = current.trim();

        return (c && !c.includes(h))
          ? accumulator.concat(c)
          : accumulator;
      }, [])))
  );
};

/*
 *  OMFG
 */
const concatatenateCSVs = (filePath, filePathList) => (
  ensureFile(filePath)
    .then(() => mapFilePathList(filePathList))
    .then(transformFromBuffer)
    .then(concatenate)
    .then(transformToString)
    .then((fileData) => writeCancatenatedCSV(filePath, fileData))
    .catch((reason) => {
      Logger.error(reason);
      process.exit(2);
    })
);

const getFilePath = () => `./concatenate/${getNow()}.csv`;

glob([`${artifacts}/**/*.csv`, `!${getFilePath()}`], async (e, filePathList) => await (e) ? process.exit(1) : concatatenateCSVs(getFilePath(), filePathList));
