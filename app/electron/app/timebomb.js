const axios = require('axios');
const cF = require('../utils/commonFunc');
const { ipcMain } = require('electron');

const timebomb = mainWindow => {
  ipcMain.on('timebomb:set', (event, {
    objType,
    signature,
    timestamp,
    userData,
    raftNode
  }) => {
    console.log(`timestamp ${timestamp}`);
    const key = objType === 'file' ? `${userData.cpk}_fls` : `${userData.cpk}_nts`;
    return axios.get(`${raftNode}/key/${key}`)
      .then(({ data }) => cF.decryptDataFromRaft(data, key, userData.csk))
      //  add new one
      .then(theData => {
        const newData = JSON.stringify({
          ...theData,
          [signature]: {
            ...theData[signature],
            timebomb: timestamp
          }
        });
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        const data = {
          [key]: cF.aesEncrypt(newData, userData.csk).encryptedHex
        };
        return axios.post(`${raftNode}/key`, data, config)
          .then(() => mainWindow.webContents.send('timebomb:set-success'))
          .catch(({ response }) => cF.catchRestError(mainWindow, response, 'timebomb:set'));
      })
      .catch(({ response }) => cF.catchRestError(mainWindow, response, 'timebomb:set', 'GET'));
  });
};

export default timebomb;
