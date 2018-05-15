const axios = require('axios');
const { ipcMain, dialog } = require('electron');

const raft = mainWindow => {
  ipcMain.on('user-data:get', (event, { userData, raftNode }) => {
    console.log('get user data');
    //  requests to get folders, files, notes
    const foldersKey = `${userData.cpk}_flds`;
    const filesKey = `${userData.cpk}_fls`;
    const notesKey = `${userData.cpk}_nts`;
    const reqs = [
      axios.get(`${raftNode}/${foldersKey}`),
      axios.get(`${raftNode}/${filesKey}`),
      axios.get(`${raftNode}/${notesKey}`),
    ];
    return Promise.all(reqs)
      .then(responses => {
        const data = {
          folders: responses[0].data[foldersKey] ? JSON.parse(responses[0].data[foldersKey]) : {},
          files: responses[1].data[filesKey] ? JSON.parse(responses[1].data[filesKey]) : {},
          notes: responses[2].data[notesKey] ? JSON.parse(responses[2].data[notesKey]) : {}
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
};

export default raft;
