import args from 'app/args';

const { env: { ARTIFACTS } } = process;
const artifacts = args.has('artifacts')
  ? args.has('artifacts')
  : ARTIFACTS;

export default artifacts;

