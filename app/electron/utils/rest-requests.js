const axios = require('axios');
const utils = require('../utils/utils');

const getAlllUserInfo = async (userData, raftNode, mainWindow) => {
  //  keys in raft
  const foldersKey = `${userData.cpk}_flds`;
  const filesKey = `${userData.cpk}_fls`;
  const notesKey = `${userData.cpk}_nts`;
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
    return mainWindow.webContents.send('user-data:get-complete', data);
  } catch ({ response }) {
    utils.catchRestError(mainWindow, response, 'user-data:get', 'GET');
  }
};

module.exports = {
  getAlllUserInfo
};
