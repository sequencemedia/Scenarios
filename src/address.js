import faker from 'faker/locale/en_GB';

import args from 'app/args';

export const address = (
  args.has('fake')
    ? {
      address1: faker.address.streetAddress(),
      address2: faker.address.streetName(),
      city: faker.address.city(),
      zip: faker.address.zipCode()
    }
    : {
      ...(args.has('address1') ? { address1: args.get('address1') } : {}),
      ...(args.has('address2') ? { address2: args.get('address2') } : {}),
      ...(args.has('city') ? { city: args.get('city') } : {}),
      ...(args.has('zip') ? { zip: args.get('zip') } : {})
    }
);
