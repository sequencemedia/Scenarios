const parser = require('yargs-parser');

export const args = new Map(Object.entries(parser(process.argv.slice(2))));
