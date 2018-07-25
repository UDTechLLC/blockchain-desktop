const axios = require('axios');

const { isOffline } = require('./../utils/utils');

const getBalance = async (address, bcNode, callback) => {
  const networkError = await isOffline();
  if (networkError) return callback(networkError);

  try {
    const { data } = await axios.get(`${bcNode}/wallet/${address}`);
    callback(undefined, data);
  } catch (e) {
    callback(e.response.data || { message: 'Blockchain nodes are not responding.' });
  }
};

const prepareTransaction = async (preparationData, bcNode, callback) => {
  const networkError = await isOffline();
  if (networkError) return callback(networkError);

  try {
    const { data } = await axios.post(`${bcNode}/tx/prepare`, preparationData);
    const { txserialized, hashes } = data;
    callback(undefined, { txserialized, hashes });
  } catch (e) {
    callback(e.response.data || { message: 'Blockchain nodes are not responding.' });
  }
};

const signTransaction = async (address, signData, bcNode, callback) => {
  const networkError = await isOffline();
  if (networkError) return callback(networkError);

  try {
    await axios.post(`${bcNode}/tx/sign`, signData);
    getBalance(address, bcNode, (error, data) => {
      if (error) return callback(error);

      callback(undefined, data);
    });
  } catch (e) {
    callback(e.response.data || { message: 'Blockchain nodes are not responding.' });
  }
};

module.exports = {
  getBalance,
  prepareTransaction,
  signTransaction
};
