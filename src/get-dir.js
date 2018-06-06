import path from 'path';

export default (iteration, scenario, timestamp) => (
  path.resolve((iteration)
    ? `./log/${scenario}/${timestamp}/${iteration}`
    : `./log/${scenario}/${timestamp}`)
);
