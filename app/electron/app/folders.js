const _ = require('lodash');
const axios = require('axios');
const { ipcMain, dialog } = require('electron');
const cF = require('../utils/commonFunc');
const { ROOT_HASH } = require('../../utils/const');

const foldersListeners = mainWindow => {
  ipcMain.on('folder:create', (event, { newFolderName, userData, raftNode }) => {
    //  key in raft
    const foldersKey = `${userData.cpk}_flds`;
    //  get actual user folders
    return axios.get(`${raftNode}/key/${foldersKey}`)
    //  decrypt users folders
      .then(({ data }) => cF.decryptDataFromRaft(data, foldersKey, userData.csk))
      //  add new one
      .then(folders => {
        const hashKey = cF.getHash(`root/${newFolderName}`, '');
        //  reject creation of folder if there is a folder with such name
        if (folders[hashKey] || hashKey === ROOT_HASH) {
          const error = `There is a folder with name "${newFolderName}"`;
          console.log(error);
          return dialog.showErrorBox('Error', error);
        }
        //  otherwise create new folder object
        const newFolder = {
          [hashKey]: {
            parentFolder: ROOT_HASH,
            name: newFolderName,
            timestamp: Math.round(+new Date() / 1000),
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
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        const data = {
          [foldersKey]: cF.aesEncrypt(updatedObj, userData.csk).encryptedHex
        };
        return axios.post(`${raftNode}/key`, data, config)
          .then(() => mainWindow.webContents.send('folder:create-success', newFolder))
          .catch(({ response }) => cF.catchRestError(mainWindow, response, 'folder:create'));
      })
      .catch(({ response }) => cF.catchRestError(mainWindow, response, 'folder:create', 'GET'));
  });
  ipcMain.on('folder:delete', (event, { folderId, userData, raftNode }) => {
    //  cannot delete root folder
    if (folderId === ROOT_HASH) {
      return dialog.showErrorBox('Error', 'You can`t delete root folder');
    }
    //  keys in raft
    const foldersKey = `${userData.cpk}_flds`;
    const filesKey = `${userData.cpk}_fls`;
    //  requests to get folders, files, notes
    const reqs = [
      axios.get(`${raftNode}/key/${foldersKey}`),
      axios.get(`${raftNode}/key/${filesKey}`)
    ];
    //  requests to get all user folders and files
    return Promise.all(reqs)
      .then(responses => ({
        folders: cF.decryptDataFromRaft(responses[0].data, foldersKey, userData.csk),
        files: cF.decryptDataFromRaft(responses[1].data, filesKey, userData.csk)
      }))
      .then(({ folders, files }) => {
        //  delete folder from raft list
        const newFolders = folders;
        delete newFolders[folderId];
        // check if folder had files
        const deleteFilesArray = _.pickBy(files, v => v.parentFolder === folderId);
        //  if folder was empty
        if (!Object.keys(deleteFilesArray).length) {
          const config = {
            headers: {
              'Content-Type': 'application/json'
            }
          };
          const data = {
            [foldersKey]: Object.keys(newFolders).length
              ? cF.aesEncrypt(JSON.stringify(newFolders), userData.csk).encryptedHex
              : '',
          };
          return axios.post(`${raftNode}/key`, data, config)
            .then(() => mainWindow.webContents.send('folder:delete-success'))
            .catch(({ response }) => cF.catchRestError(mainWindow, response, 'folder:delete'));
        }
        //  else if folder had files
        let shardsReqs = [];
        //  delete requests for all shards
        Object.keys(deleteFilesArray).forEach(signature => {
          shardsReqs = [
            ...shardsReqs,
            ...deleteFilesArray[signature].shardsAddresses.map((shardAddress, index) => (
              axios.delete(`${shardAddress}/files/${cF.aesEncrypt(signature, userData.csk).encryptedHex}.${index}`)
            ))
          ];
        });
        return Promise.all(shardsReqs)
          .then(() => {
            const updFileList = _.pickBy(files, v => v.parentFolder !== folderId);
            console.log(JSON.stringify(updFileList));
            const updData = {
              [foldersKey]: Object.keys(newFolders).length
                ? cF.aesEncrypt(JSON.stringify(newFolders), userData.csk).encryptedHex
                : '',
              [filesKey]: Object.keys(updFileList).length
                ? cF.aesEncrypt(JSON.stringify(updFileList), userData.csk).encryptedHex
                : ''
            };
            const config = {
              headers: {
                'Content-Type': 'application/json'
              }
            };
            return axios.post(`${raftNode}/key`, updData, config)
              .then(() => mainWindow.webContents.send('folder:delete-success'))
              .catch(({ response }) => cF.catchRestError(mainWindow, response, 'folder:delete'));
          })
          .catch(({ response }) => cF.catchRestError(mainWindow, response, 'folder:delete', 'DELETE'));
      })
      .catch(({ response }) => cF.catchRestError(mainWindow, response, 'folder:delete', 'GET'));
  });
};

export default foldersListeners;
