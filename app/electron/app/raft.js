const axios = require('axios');
const { ipcMain, dialog } = require('electron');
const cF = require('../utils/commonFunc');
const Folders = require('./folders');
const Files = require('./files');
const Notes = require('./notes');

const raft = mainWindow => {
  ipcMain.on('user-data:get', (event, { userData, raftNode }) => {
    // console.log(cF.getHash('root', ''));
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
        const data = {
          folders: cF.decryptDataFromRaft(responses[0].data, foldersKey, userData.csk),
          files: cF.decryptDataFromRaft(responses[1].data, filesKey, userData.csk),
          notes: cF.decryptDataFromRaft(responses[2].data, notesKey, userData.csk)
        };
        // console.log(JSON.stringify(data));
        return mainWindow.webContents.send('user-data:get-complete', data);
      })
      .catch(({ response }) => {
        const error = response && response.data ? response.data : 'unexpected error on user-data:get';
        console.log(error);
        return dialog.showErrorBox('Error on user-data:get', error);
      });
  });
  //  folders listeners
  Folders(mainWindow);
  //  files listeners
  Files(mainWindow);
  //  notes listeners
  Notes(mainWindow);
};

export default raft;
