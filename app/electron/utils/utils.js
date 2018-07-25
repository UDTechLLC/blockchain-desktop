const isOnline = require('is-online');
const aesjs = require('aes-js');
const bitcoin = require('bitcoinjs-lib');
const fs = require('fs');
const pbkdf2 = require('pbkdf2');
const { dialog } = require('electron');

/**
 * Return undefined if there is internet connection or error message if user is offline
 * @returns {Promise<*>}
 */
const isOffline = async () => {
  const isProd = process.env.NODE_ENV === 'production';
  const online = await isOnline();
  if (!online && !isProd) {
    return ({ message: 'There is no internet connection.' });
  }
  return undefined;
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

/**
 * Parse json and catch error if something wrong
 * @param string {string}
 * @param callback {function}
 */
const jsonParse = (string, callback) => {
  try {
    const obj = JSON.parse(string);
    callback(undefined, obj);
  } catch (e) {
    callback({ message: 'Invalid input data' });
  }
};

/**
 * Standard catch of rest error
 * @param error {*}
 * @param mainWindow
 * @param listenerName {String}
 * @param log {Boolean}
 * @return {listener}
 */
const errorHandler = (error, mainWindow, listenerName, log = true) => {
  if (log) console.log(`Error on ${listenerName}:`, error);
  dialog.showErrorBox(`Error on ${listenerName}:`, error.message);
  return mainWindow.webContents.send(`${listenerName}:fail`, { status: 'error', ...error });
};

module.exports = {
  isOffline,
  stringToBytes,
  ensureDirectoryExistence,
  aesEncrypt,
  aesDecrypt,
  fileCrushing,
  getHash,
  decryptDataFromRaft,
  jsonParse,
  errorHandler
};
