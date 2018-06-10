import args from 'app/args';
import toBool from 'app/to-bool';
import Logger from 'app/logger';
import generateCSVs from './generate-CSVs';
import generateTXTs from './generate-TXTs';

const app = async (csv, txt) => {
  try {
    if (csv && txt) {
      await generateCSVs();
      await generateTXTs();
    } else if (csv) {
      await generateCSVs();
    } else if (txt) {
      await generateTXTs();
    }
  } catch ({ message = 'No error message defined' }) {
    Logger.error(message);
  }
};

app(toBool(args.get('csv')), toBool(args.get('txt')));
