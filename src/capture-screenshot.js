import { ensureDir } from 'fs-extra';

import Logger from 'app/logger';

export default ({ dir, page }, key = 'screenshot') => (
  ensureDir(dir)
    .then(() => (
      page.screenshot({
        path: `${dir}/${key}.png`,
        fullPage: true
      })
    ))
    .catch(({ message = 'No error message defined.' }) => {
      Logger.error(`Error capturing screenshot. ${message}`);
    })
);
