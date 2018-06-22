// const axios = require('axios');
const { ipcMain } = require('electron');
// const utils = require('../utils/utils');
const requests = require('../utils/rest-requests');
const Folders = require('./folders');
const Files = require('./files');
const Notes = require('./notes');
const TimeBomb = require('./timebomb');

const raft = mainWindow => {
  ipcMain.on('user-data:get', (event, { userData, raftNode }) => {
    // //  keys in raft
    // const foldersKey = `${userData.cpk}_flds`;
    // const filesKey = `${userData.cpk}_fls`;
    // const notesKey = `${userData.cpk}_nts`;
    // //  requests to get folders, files, notes
    // const reqs = [
    //   axios.get(`${raftNode}/key/${foldersKey}`),
    //   axios.get(`${raftNode}/key/${filesKey}`),
    //   axios.get(`${raftNode}/key/${notesKey}`),
    // ];
    //  requests to get all user data
    // return Promise.all(reqs)
    //   .then(responses => {
    //     const data = {
    //       folders: utils.decryptDataFromRaft(responses[0].data, foldersKey, userData.csk),
    //       files: utils.decryptDataFromRaft(responses[1].data, filesKey, userData.csk),
    //       notes: utils.decryptDataFromRaft(responses[2].data, notesKey, userData.csk)
    //     };
    //     return mainWindow.webContents.send('user-data:get-complete', data);
    //   })
    //   .catch(({ response }) => utils.catchRestError(mainWindow, response, 'user-data:get', 'GET'));
    return requests.getAlllUserInfo(userData, raftNode, mainWindow);
  });
  //  folders listeners
  Folders(mainWindow);
  //  files listeners
  Files(mainWindow);
  //  notes listeners
  Notes(mainWindow);
  //  timebomb listeners
  TimeBomb(mainWindow);
};

export default raft;
