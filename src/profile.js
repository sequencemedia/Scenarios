import faker from 'faker/locale/en_GB';

import args from 'app/args';

let date;
{
  const lo = (70 * 31556926000);
  const hi = (18 * 31556926000);
  const is = Date.now();
  const alpha = new Date(is - lo);
  const omega = new Date(is - hi);
  date = faker.date.between(alpha, omega);
}

export default (
  args.has('fake')
    ? {
      firstName: faker.name.firstName(),
      lastName: faker.name.firstName(),
      title: 'Mr', // faker.name.title(),
      day: date.getDate().toString(),
      month: (date.getMonth() + 1).toString(),
      year: date.getFullYear().toString()
    }
    : {
      ...(args.has('firstName') ? { firstName: args.get('firstName') } : {}),
      ...(args.has('lastName') ? { lastName: args.get('lastName') } : {}),
      ...(args.has('title') ? { title: args.get('title') } : {}),
      ...(args.has('day') ? { day: args.get('day').toString() } : {}),
      ...(args.has('month') ? { month: args.get('month').toString() } : {}),
      ...(args.has('year') ? { year: args.get('year').toString() } : {})
    }
);
