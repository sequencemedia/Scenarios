const parser = require('yargs-parser');
const faker = require('faker/locale/en_GB');

const map = new Map(Object.entries(parser(process.argv.slice(2))));

export const contact = (
  map.has('fake')
    ? {
      email: faker.internet.email()
    }
    : {
      ...(map.has('email') ? { email: map.get('email') } : {})
    }
);
