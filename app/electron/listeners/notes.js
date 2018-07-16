const _ = require('lodash');
const axios = require('axios');
const { ipcMain, dialog } = require('electron');
const uuidv4 = require('uuid/v4');
const utils = require('../utils/utils');

const notesListeners = mainWindow => {
  // ipcMain.on('get-notes:start', (event, { userData, raftNode }) => {
  //   const key = `${userData.cpk}_gpd`;
  //   return axios.get(`${raftNode}/key/${key}`)
  //     .then(({ data }) => {
  //       const notes = data[key] ? JSON.parse(utils.aesDecrypt(data[key], userData.csk).strData) : [];
  //       return mainWindow.webContents.send('get-notes:complete', notes);
  //     })
  //     .catch(({ response }) => {
  //       console.log(response.data);
  //       return dialog.showErrorBox('Error', response.data);
  //     });
  // });
  //
  // ipcMain.on('edit-notes-list:start', (event, { notes, userData, raftNode }) => {
  //   const key = `${userData.cpk}_gpd`;
  //   const prepData = utils.aesEncrypt(JSON.stringify(notes), userData.csk).encryptedHex;
  //   return axios.post(`${raftNode}/key`, { [key]: prepData })
  //     .then(() => mainWindow.webContents.send('edit-notes-list:complete'))
  //     .catch(({ response }) => {
  //       console.log(response.data);
  //       return dialog.showErrorBox('Error', response.data);
  //     });
  //   // return axios.get(`${raftNode}/key/${key}`)
  //   //   .then(({ data }) => (
  //   //     data[key]
  //   //       ? utils.aesDecrypt(data[key], userData.csk).strData
  //   //       : JSON.stringify([])
  //   //   ))
  //   //   .then(rawData => (
  //   //     utils.aesEncrypt(JSON.stringify([
  //   //       note,
  //   //       ...JSON.parse(rawData)
  //   //     ]), userData.csk).encryptedHex
  //   //   ))
  //   //   .then(prepData => (
  //   //     new Promise((resolve, reject) => {
  //   //       setTimeout(() => (
  //   //         axios.post(`${raftNode}/key`, { [key]: prepData })
  //   //           .then(resp => resolve(resp.data))
  //   //           .catch(error => reject(error.response.data))
  //   //       ), 100);
  //   //     })
  //   //   ))
  //   //   .then(() => mainWindow.webContents.send('edit-notes-list:complete'))
  //   //   .catch(({ response }) => {
  //   //     console.log(response.data);
  //   //     return dialog.showErrorBox('Error', response.data);
  //   //   });
  // });
  //
  // ipcMain.on('delete-note:start', (event, { id, userData, raftNode }) => {
  //   const key = `${userData.cpk}_gpd`;
  //   return axios.get(`${raftNode}/key/${key}`)
  //     .then(({ data }) => (
  //       data[key]
  //         ? utils.aesDecrypt(data[key], userData.csk).strData
  //         : JSON.stringify([])
  //     ))
  //     .then(rawData => {
  //       const filteredData = JSON.parse(rawData).filter(el => el.id !== id);
  //       const strData = JSON.stringify(filteredData);
  //       return utils.aesEncrypt(strData, userData.csk).encryptedHex;
  //     })
  //     .then(prepData => (
  //       new Promise((resolve, reject) => {
  //         setTimeout(() => (
  //           axios.post(`${raftNode}/key`, { [key]: prepData })
  //             .then(resp => resolve(resp.data))
  //             .catch(error => reject(error.response.data))
  //         ), 100);
  //       })
  //     ))
  //     .then(() => mainWindow.webContents.send('delete-note:complete'))
  //     .catch(({ response }) => {
  //       console.log(response.data);
  //       return dialog.showErrorBox('Error', response.data);
  //     });
  // });
  ipcMain.on('note:create', (event, { userData, raftNode }) => {
    //  key in raft
    const notesKey = `${userData.cpk}_nts`;
    //  get actual user notes
    return axios.get(`${raftNode}/key/${notesKey}`)
      .then(({ data }) => utils.decryptDataFromRaft(data, notesKey, userData.csk))
      //  add new one
      .then(notes => {
        const id = uuidv4();
        //  reject creation of folder if there is a folder with such id
        if (notes[id]) {
          const error = 'There is a uuidv4 generation error happened!';
          console.log(error);
          return dialog.showErrorBox('Error', error);
        }
        //  otherwise create new folder object
        const newNote = {
          [id]: {
            id,
            name: 'Add Title',
            timestamp: Math.round(+new Date() / 1000),
            text: '',
            securityLayers: {
              _2fa: false,
              pin: false,
              key: false,
              voice: false
            }
          }
        };
        const updatedObj = JSON.stringify({
          ...notes,
          ...newNote
        });
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        const data = {
          [notesKey]: utils.aesEncrypt(updatedObj, userData.csk).encryptedHex
        };
        return axios.post(`${raftNode}/key`, data, config)
          .then(() => mainWindow.webContents.send('note:create-success', newNote))
          .catch(({ response }) => utils.catchRestError(mainWindow, response, 'note:create'));
      })
      .catch(({ response }) => utils.catchRestError(mainWindow, response, 'note:create', 'GET'));
  });
  ipcMain.on('note:edit', (event, {
    signature,
    noteUpdateData,
    userData,
    raftNode
  }) => {
    //  key in raft
    const notesKey = `${userData.cpk}_nts`;
    //  get actual user notes
    return axios.get(`${raftNode}/key/${notesKey}`)
      .then(({ data }) => utils.decryptDataFromRaft(data, notesKey, userData.csk))
      .then(notes => {
        const newNotes = {
          ...notes,
          [signature]: {
            ...notes[signature],
            ...noteUpdateData
          }
        };
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        const updData = {
          [notesKey]: utils.aesEncrypt(JSON.stringify(newNotes), userData.csk).encryptedHex,
        };
        return axios.post(`${raftNode}/key`, updData, config)
          .then(() => mainWindow.webContents.send('note:edit-success'))
          .catch(({ response }) => utils.catchRestError(mainWindow, response, 'note:edit'));
      })
      .catch(({ response }) => utils.catchRestError(mainWindow, response, 'note:edit', 'GET'));
  });
  ipcMain.on('note:remove', (event, { signature, userData, raftNode }) => {
    //  key in raft
    const notesKey = `${userData.cpk}_nts`;
    //  get actual user notes
    return axios.get(`${raftNode}/key/${notesKey}`)
      .then(({ data }) => utils.decryptDataFromRaft(data, notesKey, userData.csk))
      .then(notes => {
        const newNotes = _.pickBy(notes, v => v.id !== signature);
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        const updData = {
          [notesKey]: utils.aesEncrypt(JSON.stringify(newNotes), userData.csk).encryptedHex,
        };
        return axios.post(`${raftNode}/key`, updData, config)
          .then(() => mainWindow.webContents.send('note:remove-success'))
          .catch(({ response }) => utils.catchRestError(mainWindow, response, 'note:remove'));
      })
      .catch(({ response }) => utils.catchRestError(mainWindow, response, 'note:remove', 'GET'));
  });
};

export default notesListeners;
