import chalk from 'chalk';

import Logger from 'app/logger';

import transformUrl from 'app/transform-url';

export const map = new Map();

export default function ({
  iteration,
  scenario,
  timestamp = new Date(),
  client
}) {
  const onNetworkRequestWillBeSent = ({
    requestId,
    request,
    request: { url, method }
  }) => {
    if (!map.has(requestId)) {
      map.set(requestId, {
        iteration,
        scenario,
        timestamp,
        request
      });

      Logger.info(chalk.cyan('Network.requestWillBeSent'), '\n', {
        requestId,
        url: transformUrl(url),
        method
      });
    }
  };

  const onNetworkResponseReceived = ({
    requestId,
    response,
    response: {
      url,
      status,
      statusText
    }
  }) => {
    if (map.has(requestId)) {
      map.set(requestId, {
        ...map.get(requestId),
        response: {
          requestId,
          ...response
        }
      });

      Logger.info(chalk.cyan('Network.responseReceived'), '\n', {
        requestId,
        url: transformUrl(url),
        status,
        statusText
      });
    }
  };

  const onNetworkLoadingFailed = async ({ requestId, ...failed } = {}) => {
    if (map.has(requestId)) {
      map.set(requestId, {
        ...map.get(requestId),
        failed: {
          requestId,
          ...failed
        }
      });

      Logger.info(chalk.red('Network.loadingFailed'), '\n', { ...failed, requestId });
    }
  };

  const onNetworkLoadingFinished = ({ requestId, ...finished }) => {
    if (map.has(requestId)) {
      map.set(requestId, {
        ...map.get(requestId),
        finished: {
          requestId,
          ...finished
        }
      });

      Logger.info(chalk.cyan('Network.loadingFinished'), '\n', { ...finished, requestId });
    }
  };

  const attach = () => (
    Promise.resolve()
      .then(() => {
        client.on('Network.requestWillBeSent', onNetworkRequestWillBeSent);

        client.on('Network.responseReceived', onNetworkResponseReceived);

        client.on('Network.loadingFailed', onNetworkLoadingFailed);

        client.on('Network.loadingFinished', onNetworkLoadingFinished);
      })
      .then(() => {
        Logger.warn(chalk.cyan('Network.enable'));
        client.send('Network.enable');
      })
      .catch(({ message = 'No error message is defined' }) => {
        Logger.error(message);
      })
  );

  const detach = () => (
    Promise.resolve()
      .then(() => {
        client.removeListener('Network.requestWillBeSent', onNetworkRequestWillBeSent);

        client.removeListener('Network.responseReceived', onNetworkResponseReceived);

        client.removeListener('Network.loadingFailed', onNetworkLoadingFailed);

        client.removeListener('Network.loadingFinished', onNetworkLoadingFinished);
      })
      .then(() => {
        Logger.warn(chalk.cyan('Network.disable'));
        client.send('Network.disable');
      })
      .catch(({ message = 'No error message is defined' }) => {
        Logger.error(message);
      })
  );

  return {
    attach,
    detach
  };
}
