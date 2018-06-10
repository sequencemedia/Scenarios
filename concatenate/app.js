import path from 'path';
import glob from 'glob-all';
import { ensureFile } from 'fs-extra';
import {
  readFile,
  writeFile
} from 'sacred-fs';

import Logger from 'app/logger';
import artifacts from 'app/artifacts';
import getNow from 'app/get-now';

const normalize = (s = '') => s.trim();

const convertStringToArray = (s) => s.split('\n');
const convertArrayToString = (a) => a.join('\n');
const convertBufferToString = (b) => b.toString('utf8');

const reduce = (accumulator, currentLine) => {
  const line = normalize(currentLine);

  return (line)
    ? accumulator.concat(line)
    : accumulator;
};

const transformArray = (a) => a.reduce(reduce, []);

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

const transformFileToArray = (f) => convertStringToArray(normalize(convertBufferToString(f)));
const transformArrayToFile = (a) => normalize(convertArrayToString(transformArray(a)));

const readAllCSVs = (filePathList) => Promise.all(filePathList.map((filePath) => readFile(filePath)));

const writeConcatenatedCSV = (filePath, fileData) => ensureFile(filePath).then(() => writeFile(filePath, fileData));

const transformFiles = (a) => a.map(transformFileToArray);
const concatenateArrays = (a) => transformArrayToFile(concatenate(a));
const createFileData = (a) => concatenateArrays(transformFiles(a));

const getFilePath = () => path.resolve(__dirname, `${getNow()}.csv`);

const reportError = ({ message = 'No error message defined.' } = {}) => {
  Logger.error(message);
  process.exit(2);
};

const generateAllCSVs = (filePathList) => (
  readAllCSVs(filePathList)
    .then(createFileData)
    .then((fileData) => writeConcatenatedCSV(getFilePath(), fileData))
    .catch(reportError)
);

glob([`${artifacts}/**/*.csv`, `!${getFilePath()}`], async (e, filePathList) => await (e) ? reportError(e) : generateAllCSVs(filePathList));
