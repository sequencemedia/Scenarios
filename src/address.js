const parser = require('yargs-parser');
const faker = require('faker/locale/en_GB');

const map = new Map(Object.entries(parser(process.argv.slice(2))));

export const address = (
  map.has('fake')
    ? {
      address1: faker.address.streetAddress(),
      address2: faker.address.streetName(),
      city: faker.address.city(),
      zip: faker.address.zipCode()
    }
    : {
      ...(map.has('address1') ? { address1: map.get('address1') } : {}),
      ...(map.has('address2') ? { address2: map.get('address2') } : {}),
      ...(map.has('city') ? { city: map.get('city') } : {}),
      ...(map.has('zip') ? { zip: map.get('zip') } : {})
    }
);
