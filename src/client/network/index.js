import chalk from 'chalk';

import Logger from 'app/logger';

import transformUrl from 'app/transform-url';

export const map = new Map();

export default function ({
  iteration = 0,
  scenario = 'scenario',
  timestamp = new Date(),
  client
}) {
  const onNetworkRequestWillBeSent = ({
    requestId,
    request
  }) => {
    if (!map.has(requestId)) {
      map.set(requestId, {
        iteration,
        scenario,
        timestamp,
        request
      });
    }
  };

  const onNetworkResponseReceived = ({
    requestId,
    response
  }) => {
    if (map.has(requestId)) {
      map.set(requestId, {
        ...map.get(requestId),
        response: {
          requestId,
          ...response
        }
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

      const {
        request: {
          method,
          url
        } = {},
        response: {
          status,
          statusText
        } = {}
      } = map.get(requestId);

      Logger.error(chalk.red('Network.loadingFailed'), '\n', { ...failed, requestId }, {
        method,
        url: transformUrl(url),
        ...(status ? { status } : {}),
        ...(statusText ? { statusText } : {})
      });
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
      .then(() => client.send('Network.enable'))
      .catch(({ message = 'No error message is defined' }) => {
        Logger.error(message);
      })
  );

  const detach = () => (
    Promise.resolve()
      .then(() => client.send('Network.disable'))
      .then(() => {
        client.removeListener('Network.requestWillBeSent', onNetworkRequestWillBeSent);

        client.removeListener('Network.responseReceived', onNetworkResponseReceived);

        client.removeListener('Network.loadingFailed', onNetworkLoadingFailed);

        client.removeListener('Network.loadingFinished', onNetworkLoadingFinished);
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
