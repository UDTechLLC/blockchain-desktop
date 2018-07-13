const fs = require('fs');

const utils = require('../../utils/utils');
const wallet = require('../../utils/wallet');
const rest = require('../../rest/index');

const signUp = password => {
  //  create user data with wallet service
  const userData = wallet.newCredentials();
  const strData = JSON.stringify(userData);
  return utils.aesEncrypt(strData, password, 'hex').encryptedHex;
};

const signIn = (password, filePath) => {
  const credFilePath = process.platform !== 'win32' ? filePath : filePath.replace(/\\/gi, '/');
  fs.readFile(credFilePath, (error, encryptedHex) => {
    if (error && !encryptedHex) throw new Error(error);

    //  parse user credentials with passed password
    const strUserData = utils.aesDecrypt(encryptedHex, password, 'hex').strData;

    //  parse user credentials with passed password
    utils.jsonParse(strUserData, (err, userData) => {
      if (err) {
        //  in case of troubles with parse decrypted info - there is wrong password
        throw new Error({ message: 'Wrong password!' });
      } else if (!wallet.validateAddress(userData.address)) {
        //  if decrypted address in not valid - throw an error
        throw new Error({ message: 'There`s something wrong with your credentials!' });
      }

      const passwordHash = utils.getHash(password);

      //  get digest through rest
      rest.getDigest(userData, passwordHash, (digestError, digestInfo) => {
        if (digestError) throw new Error(digestError);

        // get raft info
        rest.getAllUserInfo(userData, digestInfo.raftNodes[0], (userInfoError, userInfo) => {
          if (userInfoError) throw new Error(userInfoError);

          //  mount fs
          rest.mountBuckets(userData.cpk, digestInfo.storageNodes, mountErr => {
            if (mountErr) throw new Error(mountErr);

            return { ...userInfo, digestInfo, userData };
          });
        });
      });
    });
  });
};

const signOut = (userData, storageNodes) => {
  rest.unmountBuckets(userData, storageNodes, (error, success) => {
    if (error) throw new Error(error);

    return { success };
  });
};

module.exports = {
  signUp,
  signIn,
  signOut
};
