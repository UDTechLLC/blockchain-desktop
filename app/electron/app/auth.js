/* eslint-disable max-len */
const { ipcMain } = require('electron');

const utils = require('../utils/utils');
const wallet = require('../utils/wallet');

const auth = mainWindow => {
  //  on credentials generate listener
  ipcMain.on('registration:start', (event, password) => {
    //  create user data with wallet service
    const userData = wallet.newCredentials();
    const strData = JSON.stringify(userData);
    const encryptedData = utils.aesEncrypt(strData, password, 'hex').encryptedHex;
    return mainWindow.webContents.send('registration:complete', encryptedData);
    //  save to file
    // if (utils.ensureDirectoryExistence(configFolder)) {
    //   const aes = utils.aesEncrypt(strData, password, 'hex');
    //   fs.readdir(configFolder, (error, files) => {
    //     if (error) {
    //       dialog.showErrorBox('Error', error);
    //     }
    //     const credFiles = files.map(file => (
    //       !file.indexOf('credentials')
    //         ? file
    //         : null
    //     ));
    //     const credArr = utils.cleanArray(credFiles);
    //     fs.writeFile(`${configFolder}/credentials-${credArr.length}.bak`, aes.encryptedHex, err => {
    //       if (err) {
    //         dialog.showErrorBox('Error', err);
    //       }
    //       mainWindow.webContents.send('registration:complete', strData);
    //     });
    //   });
    // }
  });

  // //  on auth listener
  // ipcMain.on('auth:start', (event, { password, filePath }) => {
  //   let encryptedHex;
  //   // eslint-disable-next-line comma-spacing
  //   let credFilePath = process.platform !== 'win32' ? filePath : filePath.replace(/\\/gi,'/');
  //   if (credFilePath.indexOf('/') < 0 || !credFilePath) {
  //     credFilePath = `${configFolder}/${filePath}`;
  //   }
  //   return fs.readFile(credFilePath, (err, data) => {
  //     if (err) {
  //       dialog.showErrorBox('Error', err);
  //     }
  //     encryptedHex = data;
  //     if (!encryptedHex) {
  //       dialog.showErrorBox('Error', 'There is no credentials file');
  //       return;
  //     }
  //     const decrypt = utils.aesDecrypt(encryptedHex, password, 'hex');
  //
  //     //  send cpk of user to main func
  //     cpkGlob = JSON.parse(decrypt.strData).cpk;
  //
  //     // on user data decryption and mounting fs - give userData to react part
  //     mainWindow.webContents.send('auth:complete', decrypt.strData);
  //   });
  // });

  // decrypt credentials with password
  ipcMain.on('crypto:decrypt-credentials', (event, { string, password }) => {
    const credentials = utils.aesDecrypt(string, password, 'hex').strData;
    return mainWindow.webContents.send('crypto:decrypted-credentials', credentials);
  });
};

export default auth;

// class Auth {
//   constructor(mainWindow, configFolder, cpkGlob) {
//     this.mainWindow = mainWindow;
//     this.configFolder = configFolder;
//     this.cpkGlob = cpkGlob;
//     ipcMain.on('registration:start', (event, password) => this.regUser(password));
//   }
//   regUser = password => {
//     console.log('here we go');
//     //  create user data with wallet service
//     const userData = wallet.newCredentials();
//     const strData = JSON.stringify(userData);
//     const encryptedData = utils.aesEncrypt(strData, password, 'hex').encryptedHex;
//     return this.mainWindow.webContents.send('registration:complete', encryptedData);
//   }
// }
//
// export default Auth;
