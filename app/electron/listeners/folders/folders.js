const _ = require('lodash');
const uuidv4 = require('uuid/v4');

const key = require('./../../utils/raft-keys');
const utils = require('./../../utils/utils');
const rest = require('./../../rest');

const createOne = (name, parentFolder, { cpk, csk }, raftNode) => {
  //  key in raft
  const foldersKey = key.foldersKey(cpk);
  //  generate new folder id
  const id = uuidv4();
  if (id === parentFolder) throw new Error({ message: 'There is id generation error happened!' });
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
    if (error) throw new Error(error);

    return folder;
  });
};

const editOne = (folder, { cpk, csk }, raftNode) => {
  //  keys in raft
  const foldersKey = key.foldersKey(cpk);
  const theFolder = { [folder.id]: folder };

  const mode = { operation: 'edit', objects: 'folders' };
  rest.editKeyValue(mode, foldersKey, theFolder, raftNode, csk, error => {
    if (error) throw new Error(error);

    return theFolder;
  });
};

const remove = (folders, { cpk, csk }, raftNode) => {
  //  keys in raft
  const foldersKey = key.foldersKey(cpk);
  const filesKey = key.filesKey(cpk);

  rest.removeKeyValues(foldersKey, Object.keys(folders), raftNode, csk, error => {
    if (error) throw new Error(error);

    rest.getValuesByKvKey(filesKey, raftNode, csk, (err, files) => {
      if (err) throw new Error(err);

      const deleteFilesObj = _.pickBy(files, v => (
        _.includes(Object.keys(folders), v.parentFolder)
      ));

      //  if there is some files in folder
      if (Object.keys(deleteFilesObj).length) {
        rest.removeKeyValues(filesKey, Object.keys(deleteFilesObj), raftNode, csk, e => {
          if (e) throw new Error(e);

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
            if (deleteError) throw new Error(deleteError);

            return deleteFilesObj;
          });
        });
      }

      return deleteFilesObj;
    });
  });
};

module.exports = {
  createOne,
  editOne,
  remove
};
