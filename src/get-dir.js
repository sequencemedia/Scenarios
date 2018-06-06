import path from 'path';
import artifacts from 'app/artifacts';

export default (iteration, scenario, timestamp) => (
  path.resolve((iteration)
    ? `${artifacts}/${scenario}/${timestamp}/${iteration}`
    : `${artifacts}/${scenario}/${timestamp}`)
);
