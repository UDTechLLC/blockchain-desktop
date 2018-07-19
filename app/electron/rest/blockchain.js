const axios = require('axios');

const getBalance = async (address, bcNode, callback) => {
  try {
    const { data } = await axios.get(`${bcNode}/wallet/${address}`);
    callback(undefined, data);
  } catch (e) {
    callback(e.response.data);
  }
};

const prepareTransaction = async (preparationData, bcNode, callback) => {
  try {
    const { data } = await axios.post(`${bcNode}/tx/prepare`, preparationData);
    const { txserialized, hashes } = data;
    callback(undefined, { txserialized, hashes });
  } catch (e) {
    callback(e.response.data);
  }
};

const signTransaction = async (address, signData, bcNode, callback) => {
  try {
    await axios.post(`${bcNode}/tx/sign`, signData);
    getBalance(address, bcNode, (error, data) => {
      if (error) return callback(error);

      callback(undefined, data);
    });
  } catch (e) {
    callback(e.response.data);
  }
};

module.exports = {
  getBalance,
  prepareTransaction,
  signTransaction
};
