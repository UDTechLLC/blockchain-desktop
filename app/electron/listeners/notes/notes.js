const uuidv4 = require('uuid/v4');

const key = require('./../../utils/raft-keys');
const rest = require('./../../rest');

const createOne = ({ cpk, csk }, raftNode) => {
  const notesKey = key.notesKey(cpk);

  const id = uuidv4();
  const note = {
    [id]: {
      id,
      name: 'Add Title',
      timestamp: new Date().getTime(),
      text: undefined,
      securityLayers: {
        _2fa: false,
        pin: false,
        key: false,
        voice: false
      }
    }
  };

  const mode = { operation: 'add', objects: 'notes' };
  rest.editKeyValue(mode, notesKey, note, raftNode, csk, error => {
    if (error) throw new Error(error);

    return note;
  });
};

const editOne = (note, { cpk, csk }, raftNode) => {
  const notesKey = key.notesKey(cpk);

  const mode = { operation: 'edit', objects: 'notes' };
  rest.editKeyValue(mode, notesKey, note, raftNode, csk, error => {
    if (error) throw new Error(error);

    return note;
  });
};

const remove = (notes, { cpk, csk }, raftNode) => {
  const notesKey = key.notesKey(cpk);

  rest.removeKeyValues(notesKey, Object.keys(notes), raftNode, csk, error => {
    if (error) throw new Error(error);

    return notes;
  });
};

module.exports = {
  createOne,
  editOne,
  remove
};
