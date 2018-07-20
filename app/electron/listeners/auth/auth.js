const fs = require('fs');

const utils = require('../../utils/utils');
const wallet = require('../../utils/wallet');
const rest = require('../../rest/index');

const signUp = (password, callback) => {
  //  create user data with wallet service
  const userData = wallet.newCredentials();
  const strData = JSON.stringify(userData);
  const encryptedHex = utils.aesEncrypt(strData, password, 'hex').encryptedHex;
  return callback(undefined, encryptedHex);
};

const signIn = (password, filePath, callback) => {
  const credFilePath = process.platform !== 'win32' ? filePath : filePath.replace(/\\/gi, '/');
  fs.readFile(credFilePath, (error, encryptedHex) => {
    if (error && !encryptedHex) return callback(error);

    //  parse user credentials with passed password
    const strUserData = utils.aesDecrypt(encryptedHex, password, 'hex').strData;

    //  parse user credentials with passed password
    utils.jsonParse(strUserData, (err, userData) => {
      if (err) {
        //  in case of troubles with parse decrypted info - there is wrong password
        return callback({ message: 'Wrong password!' });
      } else if (!wallet.validateAddress(userData.address)) {
        //  if decrypted address in not valid - throw an error
        return callback({ message: 'There`s something wrong with your credentials!' });
      }

      const passwordHash = utils.getHash(password);

      //  get digest through rest
      rest.getDigest(userData, passwordHash, (digestError, digestInfo) => {
        if (digestError) return callback(digestError);

        // get raft info
        rest.getAllUserInfo(userData, digestInfo.raftNodes[0], (userInfoError, userInfo) => {
          if (userInfoError) return callback(userInfoError);

          //  get bc balance
          rest.getBalance(userData.address, digestInfo.bcNodes[0], (bcError, wallet) => {
            if (bcError) return callback(bcError);

            //  mount fs
            rest.mountBuckets(userData.cpk, digestInfo.storageNodes, mountErr => {
              if (mountErr) return callback(mountErr);

              return callback(undefined, { ...userInfo, wallet, digestInfo, userData });
            });
          });
        });
      });
    });
  });
};

const signOut = (userData, storageNodes, callback) => {
  rest.unmountBuckets(userData, storageNodes, (error, success) => {
    if (error) return callback(error);

    return callback(undefined, { success });
  });
};

module.exports = {
  signUp,
  signIn,
  signOut
};
