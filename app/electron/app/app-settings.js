const axios = require('axios');
const { ipcMain } = require('electron');
const utils = require('../utils/utils');

const appSettings = mainWindow => {
  ipcMain.on('app-settings:get', (event, { userData, raftNode }) => {
    //  key in raft
    const settingsKey = `${userData.cpk}_stt`;
    //  request to raft
    return axios.get(`${raftNode}/key/${settingsKey}`)
      .then(({ data }) => {
        const settings = utils.decryptDataFromRaft(data, settingsKey, userData.csk);
        return mainWindow.webContents.send('app-settings:get-complete', settings);
      })
      .catch(({ response }) => utils.catchRestError(mainWindow, response, 'app-settings:get', 'GET'));
  });

  ipcMain.on('app-settings:change', (event, { newSettings, userData, raftNode }) => {
    //  key in raft
    const settingsKey = `${userData.cpk}_stt`;
    //  request to raft
    const data = {
      [settingsKey]: utils.aesEncrypt(JSON.stringify(newSettings), userData.csk).encryptedHex
    };
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return axios.post(`${raftNode}/key`, data, config)
      .then(() => mainWindow.webContents.send('app-settings:change-success'))
      .catch(({ response }) => utils.catchRestError(mainWindow, response, 'app-settings:change'));
  });
};

export default appSettings;
