import chalk from 'chalk';

import Logger from 'app/logger';

import requestMap from 'app/request-map';
import transformUrl from 'app/transform-url';

const getResponseBody = async (client, requestId) => {
  const { body } = await client.send('Network.getResponseBody', { requestId });
  return body;
};

export default function (client) {
  const onNetworkRequestWillBeSent = ({ requestId, request, request: { url, method } }) => {
    if (!requestMap.has(requestId)) {
      requestMap.set(requestId, { request });

      Logger.info(chalk.cyan('Network.requestWillBeSent'), '\n', {
        requestId,
        url: transformUrl(url),
        method
      });
    }
  };

  const onNetworkResponseReceived = ({
    requestId,
    response: {
      url,
      status,
      statusText
    }
  }) => {
    if (requestMap.has(requestId)) {
      requestMap.set(requestId, {
        ...requestMap.get(requestId),
        response: {
          requestId,
          url: transformUrl(url),
          status,
          statusText
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
    if (requestMap.has(requestId)) {
      requestMap.set(requestId, {
        ...requestMap.get(requestId),
        failed: {
          requestId,
          ...failed,
          body: await getResponseBody(client, requestId)
        }
      });

      Logger.info(chalk.red('Network.loadingFailed'), '\n', { ...failed, requestId }, await getResponseBody(client, requestId));
    }
  };

  const onNetworkLoadingFinished = ({ requestId, ...finished }) => {
    if (requestMap.has(requestId)) {
      requestMap.set(requestId, {
        ...requestMap.get(requestId),
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
        client.send('Network.enable');
      })
  );

  const detach = () => (
    Promise.resolve()
      .then(() => {
        client.send('Network.disable');
      })
      .then(() => {
        client.removeListener('Network.requestWillBeSent', onNetworkRequestWillBeSent);

        client.removeListener('Network.responseReceived', onNetworkResponseReceived);

        client.removeListener('Network.loadingFailed', onNetworkLoadingFailed);

        client.removeListener('Network.loadingFinished', onNetworkLoadingFinished);
      })
  );

  return {
    attach,
    detach
  };
}
