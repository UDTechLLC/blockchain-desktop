const axios = require('axios');
const { ipcMain, dialog } = require('electron');
const cF = require('../utils/commonFunc');

const foldersListeners = (mainWindow, folders) => {
  ipcMain.on('folder:create', (event, { newFolderName, userData, raftNode }) => {
    // console.log(folders);
    // console.log(`create new folder "${newFolderName}"`);
    // console.log(`${raftNode}/key/${userData.cpk}_flds`);
    //  create new folder object
    const hashKey = cF.getHash(newFolderName);
    const newFolder = {
      [hashKey]: {
        parentFolder: 'b472a266d0bd89c13706a4132ccfb16f7c3b9fcb',
        name: newFolderName,
        securityLayers: {
          _2fa: false,
          pin: false,
          key: false,
          voice: false
        }
      }
    };
    const updatedObj = JSON.stringify({
      ...folders,
      ...newFolder
    });
    // console.log(`updatedObj: ${updatedObj}`);
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const data = {
      [`${userData.cpk}_flds`]: cF.aesEncrypt(updatedObj, userData.csk).encryptedHex
    };
    return axios.post(`${raftNode}/key`, data, config)
      .then(() => mainWindow.webContents.send('folder:create-success', newFolder))
      .catch(({ response }) => {
        const error = response && response.data ? response.data : 'unexpected error on folder:create';
        console.log(error);
        return dialog.showErrorBox('Error on folder:create', error);
      });
  });
};

export default foldersListeners;
