const parser = require('yargs-parser');
const faker = require('faker/locale/en_GB');

const map = new Map(Object.entries(parser(process.argv.slice(2))));

let date;
{
  const lo = (70 * 31556926000);
  const hi = (18 * 31556926000);
  const is = Date.now();
  const alpha = new Date(is - lo);
  const omega = new Date(is - hi);
  date = faker.date.between(alpha, omega);
}

export const profile = (
  map.has('fake')
    ? {
      firstName: faker.name.firstName(),
      lastName: faker.name.firstName(),
      title: 'Mr', // faker.name.title(),
      day: date.getDate().toString(),
      month: (date.getMonth() + 1).toString(),
      year: date.getFullYear().toString()
    }
    : {
      ...(map.has('firstName') ? { firstName: map.get('firstName') } : {}),
      ...(map.has('lastName') ? { lastName: map.get('lastName') } : {}),
      ...(map.has('title') ? { title: map.get('title') } : {}),
      ...(map.has('day') ? { day: map.get('day').toString() } : {}),
      ...(map.has('month') ? { month: map.get('month').toString() } : {}),
      ...(map.has('year') ? { year: map.get('year').toString() } : {})
    }
);
