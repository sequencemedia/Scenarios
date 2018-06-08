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

const reduce = (accumulator, currentLine) => {
  const line = normalizeLine(currentLine);

  return (line)
    ? accumulator.concat(line)
    : accumulator;
};

const transformFileToArray = (f) => convertStringToArray(normalizeFile(convertBufferToString(f)));
const transformArrayToFile = (a) => convertArrayToString(a.reduce(reduce, []));

const readAllCSVs = (filePathList) => Promise.all(filePathList.map((f) => readFile(f)));

const writeConcatenatedCSV = (filePath, fileData) => writeFile(filePath, fileData);

const transformFiles = (fileDataList) => fileDataList.map(transformFileToArray);

const concatenate = ([[head = '', ...body] = [], ...rest] = []) => {
  const h = head.trim();

  return (
    [].concat(
      head,
      body,
      rest.reduce((accumulator, [HEAD = '', ...BODY] = []) => {
        const H = HEAD.trim();

        return (H && !h.includes(H))
          ? accumulator.concat(HEAD, BODY)
          : accumulator.concat(BODY);
      }, [])
    )
  );
};

const concatenateArrays = (a) => transformArrayToFile(concatenate(a));

/*
 *  OMFG
 */
const concatenateAllCSVs = (filePath, filePathList) => (
  ensureFile(filePath)
    .then(() => transformFiles(readAllCSVs(filePathList)))
    .then((fileDataList) => writeConcatenatedCSV(filePath, concatenateArrays(fileDataList)))
    .catch((reason) => {
      Logger.error(reason);
      process.exit(2);
    })
);

const getFilePath = () => `./concatenate/${getNow()}.csv`;

glob([`${artifacts}/**/*.csv`, `!${getFilePath()}`], async (e, filePathList) => await (e) ? process.exit(1) : concatenateAllCSVs(getFilePath(), filePathList));
