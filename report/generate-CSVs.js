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

const normalizeFile = (string = '') => {
  let s = string.trim();
  while (/\n\n/.test(s)) s = s.replace(/\n\n/g, '\n');
  return s.trim();
};

const normalizeLine = (string = '') => {
  let s = string.trim();
  while (/^,/.test(s)) s = s.replace(/^,/g, '');
  return s.trim();
};

const reduce = (accumulator, currentLine) => {
  const line = normalizeLine(currentLine);

  return (line)
    ? accumulator.concat(line)
    : accumulator;
};

const normalizeAllLines = (a) => a.reduce(reduce, []);

const concatenate = ([[head = '', ...body] = [], ...rest] = []) => {
  const h = head.trim();
  const r = (accumulator, [HEAD = '', ...BODY] = []) => {
    const H = HEAD.trim();

    return (H && !h.includes(H))
      ? accumulator.concat(HEAD, BODY)
      : accumulator.concat(BODY);
  };

  return [
    head
  ].concat(
    body,
    rest.reduce(r, [])
  );
};

const transformFileToArray = (f) => convertStringToArray(normalizeFile(convertBufferToString(f)));
const transformArrayToFile = (a) => convertArrayToString(normalizeAllLines(a));

const readAllCSVs = (filePathList) => Promise.all(filePathList.map((filePath) => readFile(filePath)));

const writeConcatenatedCSV = (filePath, fileData) => ensureFile(filePath).then(() => writeFile(filePath, fileData));

const transformFiles = (a) => a.map(transformFileToArray);
const concatenateArrays = (a) => transformArrayToFile(concatenate(a));
const createFileData = (a) => concatenateArrays(transformFiles(a));

const getFilePath = () => `./report/${getNow()}.csv`;

/*
 *  OMFG
 */
const generateAllCSVs = (filePathList) => (
  readAllCSVs(filePathList)
    .then(createFileData)
    .then((fileData) => writeConcatenatedCSV(getFilePath(), fileData))
    .catch(({ message = 'No error message defined' }) => {
      Logger.error(message);
      process.exit(2);
    })
);

export default () => (
  new Promise((resolve, reject) => {
    glob([`${artifacts}/**/*.csv`, `!${getFilePath()}`], (e, filePathList) =>(!e) ? generateAllCSVs(filePathList).then(resolve) : reject(e));
  })
);
