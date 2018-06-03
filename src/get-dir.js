import path from 'path';

export default (iteration, scenario, now) => (
  path.resolve((iteration)
    ? `./log/${scenario}/${now}/${iteration}`
    : `./log/${scenario}/${now}`)
);
