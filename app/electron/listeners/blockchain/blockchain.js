const rest = require('./../../rest/blockchain');
const { validateAddress, ecdsaSign } = require('./../../utils/wallet');

const createTransaction = (userData, to, amount, bcNode, callback) => {
  if (!validateAddress(to)) return callback({ message: 'Entered address is not valid!' });

  const from = userData.address;
  //  prepare transaction
  const preparationData = {
    from,
    to,
    amount: parseInt(amount, 10),
    pubkey: userData.cpk
  };

  rest.prepareTransaction(preparationData, bcNode, (error, { txserialized, hashes }) => {
    if (error) return callback(error);

    //  sign transaction
    const signatures = hashes.map(transactionHash => ecdsaSign(transactionHash, userData.csk));
    const signData = { txserialized, signatures, from };

    rest.signTransaction(from, signData, bcNode, (err, balance) => {
      if (err) return callback(err);

      callback(undefined, balance);
    });
  });
};

module.exports = { createTransaction };
