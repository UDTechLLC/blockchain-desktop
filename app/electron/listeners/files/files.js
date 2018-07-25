const key = require('./../../utils/raft-keys');
const rest = require('./../../rest');

const upload = (files, { cpk, csk }, storageNodes, raftNode, callback) => {
  const filesKey = key.filesKey(cpk);

  rest.files2FS(files, 3, storageNodes, cpk, csk, (error, newFiles) => {
    if (error) return callback(error);

    const mode = { operation: 'add', objects: 'files' };
    rest.editKeyValue(mode, filesKey, newFiles, raftNode, csk, err => {
      if (err) return callback(err);

      return callback(undefined, newFiles);
    });
  });
};

const downloadOne = (signature, { cpk, csk }, raftNode, callback) => {
  const filesKey = key.filesKey(cpk);

  rest.getValuesByKvKey(filesKey, raftNode, csk, (error, files) => {
    if (error) return callback(error);

    const fileData = files[signature];

    rest.getFileFromFS(signature, fileData.shardsAddresses, csk, (err, base64File) => {
      if (err) return callback(err);

      return callback(undefined, { name: fileData.name, base64File });
    });
  });
};

const remove = (files, { cpk, csk }, raftNode, callback) => {
  const filesKey = key.filesKey(cpk);

  rest.removeFilesFromFs(filesKey, files, raftNode, csk, (error, delFiles) => {
    if (error) return callback(error);

    rest.removeKeyValues(filesKey, Object.keys(delFiles), raftNode, csk, err => {
      if (err) return callback(err);

      return callback(undefined, delFiles);
    });
  });
};

module.exports = {
  upload,
  downloadOne,
  remove
};
