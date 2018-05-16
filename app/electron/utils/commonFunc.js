/* eslint-disable max-len,no-plusplus */
// const _ = require('lodash');
const aesjs = require('aes-js');
const axios = require('axios');
const bitcoin = require('bitcoinjs-lib');
const fs = require('fs');
const pbkdf2 = require('pbkdf2');


/**
 * unmount fs buckets
 * @param cpk {string}
 * @param serversArray {array}
 * @param funcAfter {function}
 */
const unmountFs = (cpk, serversArray, funcAfter = null) => {
  const reqs = serversArray.map(url => axios.post(`${url}/${cpk}/unmount`));
  axios.all(reqs)
    .catch(error => {
      console.log(error);
      if (funcAfter) {
        funcAfter();
      }
    });
};

/**
 * convert string to bytes array
 * @param string {string}
 * @returns {Array}
 */
const stringToBytes = string => {
  const result = [];
  for (let i = 0; i < string.length; i++) {
    result.push(string.charCodeAt(i));
  }
  return result;
};

/**
 * clean array from null values
 * @param actual {Array}
 * @returns {Array}
 */
const cleanArray = actual => {
  const newArray = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
};

/**
 * check does folder exist
 * @param filePath {string}
 * @returns {bool}
 */
const ensureDirectoryExistence = filePath => {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath);
    ensureDirectoryExistence(filePath);
  }
  return true;
};

/**
 * AES encryption of data
 * @param data {string}
 * @param password {string}
 * @param stringStandard {string}
 * @param aesJsCounter {number}
 * @returns {{salt: string, aesKey, dataBytes: *, aesCtr: ModeOfOperationCTR, encryptedBytes: *|PromiseLike<ArrayBuffer>, encryptedHex: *}}
 */
const aesEncrypt = (data, password, stringStandard = 'base64', aesJsCounter = 5) => {
  //  create salt
  const salt = bitcoin.crypto.sha256(Buffer.from(password))
    .toString(stringStandard).substring(0, 4);
  //  create key
  const aesKey = pbkdf2.pbkdf2Sync(password, salt, 1, 128 / 8, 'sha256');
  const dataBytes = aesjs.utils.utf8.toBytes(data);
  //  eslint-disable-next-line new-cap
  const aesCtr = new aesjs.ModeOfOperation.ctr(aesKey, new aesjs.Counter(aesJsCounter));
  //  encrypt password
  const encryptedBytes = aesCtr.encrypt(dataBytes);
  const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  return {
    salt,
    aesKey,
    dataBytes,
    aesCtr,
    encryptedBytes,
    encryptedHex
  };
};

/**
 * AES decryption of data
 * @param encryptedHex {string}
 * @param password {string}
 * @param stringStandard {string}
 * @param aesJsCounter {number}
 * @returns {{salt: string, aesKey, encryptedBytes: *, aesCtr: ModeOfOperationCTR, decryptedBytes: *|PromiseLike<ArrayBuffer>, strData: *}}
 */
const aesDecrypt = (encryptedHex, password, stringStandard = 'base64', aesJsCounter = 5) => {
  //  create salt
  const salt = bitcoin.crypto.sha256(Buffer.from(password))
    .toString(stringStandard).substring(0, 4);
  //  create key
  const aesKey = pbkdf2.pbkdf2Sync(password, salt, 1, 128 / 8, 'sha256');
  //  from file to bytes
  const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex.toString());
  //  eslint-disable-next-line new-cap
  const aesCtr = new aesjs.ModeOfOperation.ctr(aesKey, new aesjs.Counter(aesJsCounter));
  // decrypt...
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);
  const strData = aesjs.utils.utf8.fromBytes(decryptedBytes);
  return {
    salt,
    aesKey,
    encryptedBytes,
    aesCtr,
    decryptedBytes,
    strData
  };
};

/**
 * file crushing for n parts
 * @param file {object}
 * @param shardsNumber {number}
 * @returns {Array}
 */
const fileCrushing = (file, shardsNumber = 3) => {
  // console.log(file.name, shardsNumber);
  const fileLength = file.data.length;
  const pieceSize = Math.floor((fileLength - (file.size % shardsNumber)) / shardsNumber);
  const resultArray = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i <= shardsNumber - 1; i++) {
    let zeroPoint = pieceSize * i;
    const endPoint = pieceSize * (i + 1);
    if (i === shardsNumber - 1) {
      zeroPoint = (2 * pieceSize);
      resultArray.push(file.data.substring(zeroPoint));
      break;
    }
    resultArray.push(file.data.substring(zeroPoint, endPoint));
  }
  return resultArray;
};

/**
 * get hash from string
 * @param string {string}
 * @param format {string}
 * @returns {string}
 */
const getHash = (string, format = 'hex') => {
  const buffer = Buffer.from(string, format);
  const publicSHA256 = bitcoin.crypto.sha256(buffer);
  return bitcoin.crypto.ripemd160(publicSHA256).toString('hex');
};

// /**
//  * get axios response data and insert new data inside with previous encryption of it
//  * @param data {string}
//  * @param newDataObject {object}
//  * @param key {string}
//  * @param password {string}
//  * @returns {Object}
//  */
// const encryptDataForRaft = (data, newDataObject, key, password) => {
//   const defaultObj = data.length
//     ? JSON.parse(data)[key]
//     : {};
//   const encryptedNewDataObj = _.mapValues(newDataObject, v => aesEncrypt(JSON.stringify(v), password).encryptedHex);
//   return {
//     ...defaultObj,
//     ...encryptedNewDataObj
//   };
// };

/**
 * decrypt users data object after axios request
 * @param data {object}
 * @param key {string}
 * @param password {string}
 * @returns {object}
 */
const decryptDataFromRaft = (data, key, password) => (
  // const rawSettings = data.length
  //   ? JSON.parse(data)[key]
  //   : {};
  // return Object.keys(rawSettings).length
  //   ? _.mapValues(rawSettings, v => JSON.parse(aesDecrypt(v, password).strData))
  //   : {};
  // console.log(JSON.stringify(data), key, password);
  typeof data === 'object' && data[key]
    ? JSON.parse(aesDecrypt(data[key], password).strData)
    : {}
);

module.exports = {
  unmountFs,
  stringToBytes,
  cleanArray,
  ensureDirectoryExistence,
  aesEncrypt,
  aesDecrypt,
  fileCrushing,
  getHash,
  // encryptDataForRaft,
  decryptDataFromRaft
};
