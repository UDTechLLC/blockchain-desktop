const _ = require('lodash');
const uuidv4 = require('uuid/v4');

const key = require('./../../utils/raft-keys');
const utils = require('./../../utils/utils');
const rest = require('./../../rest');

const createOne = (name, parentFolder, { cpk, csk }, raftNode, callback) => {
  //  key in raft
  const foldersKey = key.foldersKey(cpk);
  //  generate new folder id
  const id = uuidv4();
  if (id === parentFolder) return callback({ message: 'There is id generation error happened!' });
  //  create new folder kv
  const folder = {
    [id]: {
      parentFolder: utils.getHash(parentFolder),
      id,
      name,
      timestamp: new Date().getTime(),
      securityLayers: {
        _2fa: false,
        pin: false,
        key: false,
        voice: false
      }
    }
  };

  const mode = { operation: 'add', objects: 'folders' };
  rest.editKeyValue(mode, foldersKey, folder, raftNode, csk, error => {
    if (error) return callback(error);

    return callback(undefined, folder);
  });
};

const editOne = (folder, { cpk, csk }, raftNode, callback) => {
  //  keys in raft
  const foldersKey = key.foldersKey(cpk);
  const theFolder = { [folder.id]: folder };

  const mode = { operation: 'edit', objects: 'folders' };
  rest.editKeyValue(mode, foldersKey, theFolder, raftNode, csk, error => {
    if (error) return callback(error);

    return callback(undefined, theFolder);
  });
};

const remove = (folders, { cpk, csk }, raftNode, callback) => {
  //  keys in raft
  const foldersKey = key.foldersKey(cpk);
  const filesKey = key.filesKey(cpk);

  rest.removeKeyValues(foldersKey, Object.keys(folders), raftNode, csk, error => {
    if (error) return callback(error);

    rest.getValuesByKvKey(filesKey, raftNode, csk, (err, files) => {
      if (err) return callback(err);

      const deleteFilesObj = _.pickBy(files, v => (
        _.includes(Object.keys(folders), v.parentFolder)
      ));

      //  if there is some files in folder
      if (Object.keys(deleteFilesObj).length) {
        rest.removeKeyValues(filesKey, Object.keys(deleteFilesObj), raftNode, csk, e => {
          if (e) return callback(e);

          //  else if folder had files
          let shardsReqs = [];
          //  delete requests for all shards
          Object.keys(deleteFilesObj).forEach(signature => {
            shardsReqs = [
              ...shardsReqs,
              ...deleteFilesObj[signature].shardsAddresses.map((shardAddress, index) => (
                `${shardAddress}/files/${utils.aesEncrypt(signature, csk).encryptedHex}.${index}`
              ))
            ];
          });

          rest.promiseAllDelete(shardsReqs, deleteError => {
            if (deleteError) return callback(deleteError);

            return callback(undefined, deleteFilesObj);
          });
        });
      }

      return callback(undefined, deleteFilesObj);
    });
  });
};

module.exports = {
  createOne,
  editOne,
  remove
};
