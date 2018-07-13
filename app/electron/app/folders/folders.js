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

};

const remove = (folders, { cpk, csk }, raftNode) => {

};

module.exports = {
  createOne,
  editOne,
  remove
};
