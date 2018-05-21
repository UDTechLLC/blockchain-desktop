const _  = require('lodash');
const axios = require('axios');
const { ipcMain, dialog } = require('electron');
const cF = require('../utils/commonFunc');

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
        if (folders[hashKey] || hashKey === '175aeb081e74c9116ac7f6677c874ff6963ce1f5') {
          const error = `There is a folder with name "${newFolderName}"`;
          console.log(error);
          return dialog.showErrorBox('Error', error);
        }
        //  otherwise create new folder object
        const newFolder = {
          [hashKey]: {
            parentFolder: '175aeb081e74c9116ac7f6677c874ff6963ce1f5',
            name: newFolderName,
            date: +new Date() / 1000,
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
          .catch(({ response }) => {
            const error = response && response.data ? response.data : 'Unexpected error on folder:create POST';
            console.log(error);
            return dialog.showErrorBox('Error on folder:create', error);
          });
      })
      .catch(({ response }) => {
        const error = response && response.data ? response.data : 'Unexpected error on folder:create GET';
        console.log(error);
        return dialog.showErrorBox('Error on folder:create', error);
      });
  });
  ipcMain.on('folder:delete', (event, { folderId, userData, raftNode }) => {
    //  cannot delete root folder
    if (folderId === '175aeb081e74c9116ac7f6677c874ff6963ce1f5') {
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
        files: cF.decryptDataFromRaft(responses[1].data, foldersKey, userData.csk)
      }))
      .then(({ folders, files }) => {
        //  delete folder from raft list
        // console.log(`folders ${JSON.stringify(folders)}`);
        const newFolders = folders;
        delete newFolders[folderId];
        // console.log(`newFolders ${JSON.stringify(newFolders)}`);
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
            .catch(({ response }) => {
              const error = response && response.data ? response.data : 'Unexpected error on folder:delete POST';
              console.log(error);
              return dialog.showErrorBox('Error on folder:delete', error);
            });
        }
        //  else

        // let shardsReqs = [];
        // // eslint-disable-next-line no-return-assign
        // Object.keys(deleteFilesArray).forEach(k => shardsReqs = [
        //   ...shardsReqs,
        //   ...deleteFilesArray[k].shardsAddresses
        // ]);
        // return Promise.all(reqs)
        //   .then()
        //   .catch(({ response }) => {
        //     const error = response && response.data
        // ? response.data : 'Unexpected error on folder:delete DELETE';
        //     console.log(error);
        //     return dialog.showErrorBox('Error on folder:delete', error);
        //   });
        // const newFiles = _.pickBy(files, v => v.parentFolder !== folderId);
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        const data = {
          [foldersKey]: cF.aesEncrypt(newFolders, userData.csk).encryptedHex,
          // [filesKey]: cF.a.aesEncrypt(newFiles, userData.csk).encryptedHex,
        };
        return axios.post(`${raftNode}/key`, data, config)
          .then(() => mainWindow.webContents.send('folder:delete-success'))
          .catch(({ response }) => {
            const error = response && response.data ? response.data : 'Unexpected error on folder:delete POST';
            console.log(error);
            return dialog.showErrorBox('Error on folder:delete', error);
          });
      })
      .catch(({ response }) => {
        const error = response && response.data ? response.data : 'Unexpected error on folder:delete GET';
        console.log(error);
        return dialog.showErrorBox('Error on folder:delete', error);
      });
  });
};

export default foldersListeners;
