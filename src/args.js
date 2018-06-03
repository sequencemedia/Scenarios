const parser = require('yargs-parser');

export default new Map(Object.entries(parser(process.argv.slice(2))));
