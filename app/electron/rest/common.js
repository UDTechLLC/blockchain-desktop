const axios = require('axios');

const { isOffline } = require('./../utils/utils');

/**
 * axios delete request to array of links
 * @param urlsArr {Array}
 * @param callback {Function}
 * @returns {Promise<*>}
 */
const promiseAllDelete = async (urlsArr, callback) => {
  const networkError = await isOffline();
  if (networkError) return callback(networkError);

  const reqs = urlsArr.map(url => axios.delete(url));

  try {
    await Promise.all(reqs);
    callback(undefined);
  } catch (e) {
    callback(e.response.data || { message: 'Nodes are not responding.' });
  }
};

module.exports = { promiseAllDelete };
