const _ = require('lodash');

const rest = require('./../../rest');
const raftKeys = require('./../../utils/raft-keys');

const set = (kv, ghostTime, { cpk, csk }, raftNode, callback) => {
  const key = _.findKey(kv, o => !_.isEmpty(o));
  const data = _.mapValues(kv[key], o => ({ ...o, ghostTime }));

  let kvKey = raftKeys.foldersKey(cpk);
  switch (key) {
    case 'files': kvKey = raftKeys.filesKey(cpk); break;
    case 'notes': kvKey = raftKeys.notesKey(cpk); break;
    default: break;
  }

  const mode = { operation: 'edit', objects: key };
  rest.editKeyValue(mode, kvKey, data, raftNode, csk, error => {
    if (error) return callback(error);

    return callback(undefined, {
      folders: {},
      files: {},
      notes: {},
      [key]: data
    });
  });
};

module.exports = { set };
