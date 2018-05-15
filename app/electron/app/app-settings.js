const axios = require('axios');
const { ipcMain, dialog } = require('electron');
const cF = require('../utils/commonFunc');

const appSettings = mainWindow => {
  ipcMain.on('app-settings:get', (event, { userData, raftNode }) => {
    //  key in raft
    const settingsKey = `${userData.cpk}_stt`;
    //  request to raft
    return axios.get(`${raftNode}/key/${settingsKey}`)
      .then(({ data }) => {
        const settings = cF.decryptDataFromRaft(data, settingsKey, userData.csk);
        return mainWindow.webContents.send('app-settings:get-complete', settings);
      })
      .catch(({ response }) => {
        const error = response && response.data ? response.data : 'unexpected error on app-settings:get';
        console.log(error);
        return dialog.showErrorBox('Error on app-settings:get', error);
      });
  });
};

export default appSettings;
