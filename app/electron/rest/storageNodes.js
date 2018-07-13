const _ = require('lodash');
const axios = require('axios');
const bitcoin = require('bitcoinjs-lib');

const utils = require('./../utils/utils');

/**
 * Request to mount users buckets on storage nodes
 * @param origin {String}
 * @param storageNodes {Array}
 * @param callback {Function}
 * @returns {Promise<*>}
 */
const mountBuckets = async (origin, storageNodes, callback) => {
  const threeUrls = storageNodes.slice(0, 3);

  let reqAllState = [].concat.apply([], threeUrls.map(url => (
    axios.get(`${url}/buckets/${origin}/state`)
  )));
  let reqAllMount = [].concat.apply([], threeUrls.map(url => (
    axios.post(`${url}/buckets/${origin}/mount`)
  )));

  if (threeUrls[0] === threeUrls[2]) {
    reqAllState = reqAllState.slice(0, 1);
    reqAllMount = reqAllMount.slice(0, 1);
  }

  try {
    const responses = await Promise.all(reqAllState);

    //  find out what nodes are not mounted
    const reqMount = _.compact(responses.map((response, i) => (
      !response.data.mounted ? reqAllMount[i] : undefined
    )));

    // not created
    const urlsCreate = _.compact(responses.map((response, i) => (
      !response.data.created ? threeUrls[i] : undefined
    )));

    // if we have nodes to create
    if (urlsCreate.length) {
      const createReqs = urlsCreate.map(url => (
        axios.post(url, { data: { origin } })
      ));

      await Promise.all(createReqs);
    }

    await Promise.all(reqMount);

    callback(undefined);
  } catch (e) {
    callback(e.response.data.data || e.response.data);
  }
};

/**
 * Unmount`s storage nodes buckets
 * @param userData {Object}
 * @param storageNodes {Array}
 * @param callback {Function}
 * @returns {Promise<*>}
 */
const unmountBuckets = async (userData, storageNodes, callback) => {
  const reqs = storageNodes.map(url => axios.post(`${url}/buckets/${userData.cpk}/unmount`));

  try {
    await Promise.all(reqs);
    callback(undefined, { success: true });
  } catch (e) {
    callback(e.response.data.data || e.response.data);
  }
};

/**
 * upload files to storage nodes
 * @param files {Object}
 * @param nodes {Number}
 * @param storageNodes {Array}
 * @param cpk {String}
 * @param csk {String}
 * @param callback {Function}
 * @returns {Promise<void>}
 */

const files2FS = async (files, nodes, storageNodes, cpk, csk, callback) => {
  const fsNodes = storageNodes.slice(0, nodes);
  const filesPromises = _.map(files, file => new Promise(resolve => {
    const rawShards = utils.fileCrushing(file, nodes);
    const shards = rawShards.map(shard => utils.aesEncrypt(shard, csk).encryptedHex);
    resolve({ file, shards });
  }));

  try {
    // shred files
    const filesPromisesResult = await Promise.all(filesPromises);
    // mapping through files to get reqs + files info
    const fileInfo = filesPromisesResult.map(({ file, shards }) => {
      //  create sha256 signature
      const signature = bitcoin.crypto.sha256(Buffer.from(`${file.name}${file.parentFolder}${file.size}${file.timestamp}${cpk}`))
        .toString('hex');
      //  shards addresses array
      const shardsAddresses = fsNodes.map(v => `${v}/buckets/${cpk}`);
      const reqs = shardsAddresses.map((url, index) => {
        const data = {
          data: {
            name: `${utils.aesEncrypt(signature, csk).encryptedHex}.${index}`,
            content: shards[index]
          }
        };
        return axios.post(`${url}/put`, data);
      });
      return {
        reqs,
        file: {
          [signature]: {
            name: file.name,
            parentFolder: file.parentFolder,
            size: file.size,
            timestamp: file.timestamp,
            securityLayers: {
              _2fa: false,
              pin: false,
              key: false,
              voice: false
            },
            signature,
            shardsAddresses
          }
        }
      };
    });
    //  arr of reqs
    const reqs = [].concat.apply([], fileInfo.map(o => o.reqs));
    //  object of file kv`s
    const files = Object.assign({}, ...fileInfo.map(o => o.file));
    //  send shards
    await Promise.all(reqs);
    callback(undefined, files);
  } catch (e) {
    callback(e.response.data || { message: 'Seems like something bad happened!' });
  }
};

/**
 * get file from storage nodes
 * @param signature {String}
 * @param shardsAddresses {Array}
 * @param csk {String}
 * @param callback {Function}
 * @returns {Promise<void>}
 */
const getFileFromFS = async (signature, shardsAddresses, csk, callback) => {
  const shardsReq = shardsAddresses.map((url, i) => (
    axios.get(`${url}/files/${utils.aesEncrypt(signature, csk).encryptedHex}.${i}`)
  ));

  try {
    const responses = await Promise.all(shardsReq);

    const shards = responses.map(res => utils.aesDecrypt(res.data, csk).strData);

    const base64File = shards.join('');

    callback(undefined, base64File);
  } catch (e) {
    callback(e.response.data);
  }
};

/**
 * Remove files from storage nodes
 * @param key {String}
 * @param files {Object}
 * @param raftNode {String}
 * @param csk {String}
 * @param callback {Function}
 * @returns {Promise<void>}
 */
const removeFilesFromFs = async (key, files, raftNode, csk, callback) => {
  try {
    const {data} = await axios.get(`${raftNode}/key/${key}`);
    const decryptedData = utils.decryptDataFromRaft(data, key, csk);

    const filesData = _.pick(decryptedData, Object.keys(files));

    const shardsReqs = Object.keys(filesData).map(k => (
      filesData[k].shardsAddresses.map((url, i) => (
        axios.delete(`${url}/files/${utils.aesEncrypt(k, csk).encryptedHex}.${i}`)
      ))
    ));
    const reqs = [].concat.apply([], shardsReqs);

    await Promise.all(reqs);

    callback(undefined, filesData);
  } catch (e) {
    callback(e.response.data);
  }
};

module.exports = {
  mountBuckets,
  unmountBuckets,
  files2FS,
  getFileFromFS,
  removeFilesFromFs
};
