const axios = require('axios');
const { ipcMain, dialog } = require('electron');
const cF = require('../utils/commonFunc');
const Folders = require('./folders');
const Files = require('./files');
const Notes = require('./notes');

const raft = mainWindow => {
  let folders = {};
  let files = {};
  let notes = {};

  ipcMain.on('user-data:get', (event, { userData, raftNode }) => {
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
    //  requests to get all user data
    return Promise.all(reqs)
      .then(responses => {
        folders = cF.decryptDataFromRaft(responses[0].data, foldersKey, userData.csk);
        files = cF.decryptDataFromRaft(responses[1].data, filesKey, userData.csk);
        notes = cF.decryptDataFromRaft(responses[2].data, notesKey, userData.csk);
        const data = {
          folders,
          files,
          notes
        };
        console.log(JSON.stringify(data));
        return mainWindow.webContents.send('user-data:get-complete', data);
      })
      .catch(({ response }) => {
        const error = response && response.data ? response.data : 'unexpected error on user-data:get';
        console.log(error);
        return dialog.showErrorBox('Error on user-data:get', error);
      });
  });
  //  folders listeners
  Folders(mainWindow, folders);
  //  files listeners
  Files(mainWindow, files);
  //  notes listeners
  Notes(mainWindow, notes);
};

export default raft;
