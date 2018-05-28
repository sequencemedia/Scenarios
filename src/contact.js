
import faker from 'faker/locale/en_GB';

import { args } from 'app/args';

export const contact = (
  args.has('fake')
    ? {
      email: faker.internet.email()
    }
    : {
      ...(args.has('email') ? { email: args.get('email') } : {})
    }
);
