const _ = require('lodash');
const axios = require('axios');

const utils = require('./../utils/utils');
const raftKeys = require('./../utils/raft-keys');

/**
 * Get all user info from raft
 * @param userData {Object}
 * @param raftNode {String}
 * @param callback {Function}
 * @returns {Promise<*>}
 */
const getAllUserInfo = async (userData, raftNode, callback) => {
  //  keys in raft
  const foldersKey = raftKeys.foldersKey(userData.cpk);
  const filesKey = raftKeys.filesKey(userData.cpk);
  const notesKey = raftKeys.notesKey(userData.cpk);

  //  requests to get folders, files, notes
  const reqs = [
    axios.get(`${raftNode}/key/${foldersKey}`),
    axios.get(`${raftNode}/key/${filesKey}`),
    axios.get(`${raftNode}/key/${notesKey}`),
  ];

  try {
    const responses = await Promise.all(reqs);

    const data = {
      folders: utils.decryptDataFromRaft(responses[0].data, foldersKey, userData.csk),
      files: utils.decryptDataFromRaft(responses[1].data, filesKey, userData.csk),
      notes: utils.decryptDataFromRaft(responses[2].data, notesKey, userData.csk)
    };

    return callback(undefined, data);
  } catch (e) {
    callback(e.response.data);
  }
};

/**
 * Get all info by kv key
 * @param key {String}
 * @param raftNode {String}
 * @param csk {String}
 * @param callback {Function}
 * @returns {Promise<void>}
 */
const getValuesByKvKey = async (key, raftNode, csk, callback) => {
  try {
    const { data } = await axios.get(`${raftNode}/key/${key}`);
    const decryptedData = utils.decryptDataFromRaft(data, key, csk);

    callback(undefined, decryptedData);
  } catch (e) {
    callback(e.response.data);
  }
};

/**
 * add new key-value to kV or update id depends on mode
 * @param mode {String}
 * @param key {String}
 * @param newKeyValue {Object}
 * @param raftNode {String}
 * @param csk {String}
 * @param callback {Function}
 * @returns {Promise<*>}
 */
const editKeyValue = async (mode, key, newKeyValue, raftNode, csk, callback) => {
  if (typeof mode !== 'object' || !mode.operation || !mode.objects) {
    return callback({ message: 'Kv request issues' });
  }

  try {
    const { data } = await axios.get(`${raftNode}/key/${key}`);
    const decryptedData = utils.decryptDataFromRaft(data, key, csk);

    //  check unique name and id
    if (mode.operation.toLowerCase() === 'add') {
      const uniqueId = !decryptedData[Object.keys(newKeyValue)[0]];
      const uniqueName = !Object.keys(_.pickBy(decryptedData, obj => {
        const main = newKeyValue[Object.keys(newKeyValue)[0]].name === obj.name;
        const sec = newKeyValue[Object.keys(newKeyValue)[0]].parentFolder === obj.parentFolder;

        if (mode.objects === 'files') return main && sec;

        return main;
      })).length;

      if (((!uniqueId || !uniqueName) && mode.objects !== 'notes')
        || (mode.objects === 'notes' && !uniqueId)) {
        callback({ message: 'There is a value with such name or id' });
      }
    }

    const updatedObject = { ...decryptedData, ...newKeyValue};

    const createRequestData = {
      [key]: utils.aesEncrypt(JSON.stringify(updatedObject), csk).encryptedHex
    };

    await axios.post(`${raftNode}/key`, createRequestData);

    callback(undefined);
  } catch (e) {
    callback(e.response.data);
  }
};

/**
 *
 * @param key {String}
 * @param kvKeys {Array}
 * @param raftNode {String}
 * @param csk {String}
 * @param callback {Function}
 * @returns {Promise<*>}
 */
const removeKeyValues = async (key, kvKeys, raftNode, csk, callback) => {
  try {
    const { data } = await axios.get(`${raftNode}/key/${key}`);
    const decryptedData = utils.decryptDataFromRaft(data, key, csk);

    //  check if kv with such ids is exist
    const ifNotExist = !Object.keys(_.pick(decryptedData, kvKeys)).length;
    if (ifNotExist) {
      return callback({ message: 'There is no value with such id' });
    }

    const updatedObject = _.omitBy(decryptedData, (v, k) => kvKeys.includes(k));

    const createRequestData = {
      [key]: utils.aesEncrypt(JSON.stringify(updatedObject), csk).encryptedHex
    };

    await axios.post(`${raftNode}/key`, createRequestData);

    callback(undefined);
  } catch (e) {
    callback(e.response.data);
  }
};

module.exports = {
  getAllUserInfo,
  getValuesByKvKey,
  editKeyValue,
  removeKeyValues
};
