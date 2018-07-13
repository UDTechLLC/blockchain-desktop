const axios = require('axios');

const digestUrl = process.env.WB_DIGEST;

/**
 * Request to get digest from digest server
 * @param userData {Object}
 * @param passwordHash {String}
 * @param callback {Function}
 * @returns {Promise<*>}
 */
const getDigest = async (userData, passwordHash, callback) => {
  //  hardcoded development servers
  if (process.env.NODE_ENV === 'development') {
    return callback(undefined, {
      bcNodes: ['http://127.0.0.1:4000', 'http://127.0.0.1:4000', 'http://127.0.0.1:4000'],
      raftNodes: ['http://127.0.0.1:11001', 'http://127.0.0.1:11002', 'http://127.0.0.1:11003'],
      storageNodes: ['http://127.0.0.1:13000', 'http://127.0.0.1:13001', 'http://127.0.0.1:13002'],
      spaceleft: 100,
      totalNodes: 1,
      suspicious: 7
    });
  }

  //  default request
  const reqUrl = `${digestUrl}/hello/application`;
  const reqData = {
    address: userData.address,
    pubKey: userData.cpk,
    AES: passwordHash
  };

  try {
    const { data } = await axios.post(reqUrl, reqData);
    callback(undefined, data);
  } catch (e) {
    //  in case of registration on digest servers
    if (e.response.data.message === 'PrivKey is empty') {
      try {
        const { data } = await axios.post(reqUrl, { ...reqData, PrivKey: userData.csk });
        callback(undefined, data);
      } catch (err) {
        callback(err.response.data);
      }
    }

    callback(e.response.data);
  }
};

module.exports = { getDigest };
