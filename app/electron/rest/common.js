const axios = require('axios');

/**
 * axios delete request to array of links
 * @param urlsArr {Array}
 * @param callback {Function}
 * @returns {Promise<*>}
 */
const promiseAllDelete = async (urlsArr, callback) => {
  const reqs = urlsArr.map(url => axios.delete(url));

  try {
    await Promise.all(reqs);
    callback(undefined);
  } catch (e) {
    callback(e.response.data);
  }
};

module.exports = { promiseAllDelete };
