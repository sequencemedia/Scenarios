'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _from=require('babel-runtime/core-js/array/from');var _from2=_interopRequireDefault(_from);var _=require('./..');var _logger=require('../../../logger');var _logger2=_interopRequireDefault(_logger);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}// import headers from './headers';
// const writer = Writer({ headers });
// import path from 'path';
// import fs from 'fs-extra';
// import chalk from 'chalk';
// import Writer from 'csv-stream-writer';
exports.default=function(){var array=(0,_from2.default)(_.map.values()).reduce(function(accumulator,_ref){var timestamp=_ref.timestamp;return accumulator.includes(timestamp)?accumulator:accumulator.concat(timestamp);},[]);_logger2.default.info(array);/*
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
  */};// import getDir from 'app/get-dir';
// import getNow from 'app/get-now';