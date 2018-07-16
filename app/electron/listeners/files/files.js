const key = require('./../../utils/raft-keys');
const rest = require('./../../rest');

const upload = (files, { cpk, csk }, storageNodes, raftNode) => {
  const filesKey = key.filesKey(cpk);

  rest.files2FS(files, 3, storageNodes, cpk, csk, (error, newFiles) => {
    if (error) throw new Error(error);

    const mode = { operation: 'add', objects: 'files' };
    rest.editKeyValue(mode, filesKey, newFiles, raftNode, csk, err => {
      if (err) throw new Error(err);

      return newFiles;
    });
  });
};

const downloadOne = (signature, { cpk, csk }, raftNode) => {
  const filesKey = key.filesKey(cpk);

  rest.getValuesByKvKey(filesKey, raftNode, csk, (error, files) => {
    if (error) throw new Error(error);

    const fileData = files[signature];

    rest.getFileFromFS(signature, fileData.shardsAddresses, csk, (err, base64File) => {
      if (err) throw new Error(err);

      return { name: fileData.name, base64File };
    });
  });
};

const remove = (files, { cpk, csk }, raftNode) => {
  const filesKey = key.filesKey(cpk);

  rest.removeFilesFromFs(filesKey, files, raftNode, csk, (error, delFiles) => {
    if (error) throw new Error(error);

    rest.removeKeyValues(filesKey, Object.keys(delFiles), raftNode, csk, err => {
      if (err) throw new Error(err);

      return delFiles;
    });
  });
};

module.exports = {
  upload,
  downloadOne,
  remove
};
