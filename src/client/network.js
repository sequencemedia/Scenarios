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
      requestMap.set(requestId, request);

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
      Logger.info(chalk.cyan('Network.responseReceived'), '\n', {
        requestId,
        url: transformUrl(url),
        status,
        statusText
      });
    }
  };

  const onNetworkLoadingFailed = async ({ requestId, ...response } = {}) => { // Logger.info('Network.loadingFailed', { requestId, ...response });
    if (requestMap.has(requestId)) {
      Logger.info(chalk.red('Network.loadingFailed'), '\n', { ...response, requestId }, await getResponseBody(client, requestId));
      requestMap.delete(requestId);
    }
  };

  const onNetworkLoadingFinished = ({ requestId }) => { // , ...response }) => { // Logger.info('Network.loadingFinished', { requestId, ...response });
    if (requestMap.has(requestId)) {
      Logger.info(chalk.cyan('Network.loadingFinished'), '\n', { requestId });
      requestMap.delete(requestId);
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
