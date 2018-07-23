/* eslint-disable global-require */
/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
const path = require('path');
const isOnline = require('is-online');
const { app, BrowserWindow, ipcMain, dialog } = require('electron');

const MenuBuilder = require('./menu');
const utils = require('./electron/utils/utils');

const auth = require(`./electron/listeners/auth/auth`);
const flds = require(`./electron/listeners/folders/folders`);
const fls = require(`./electron/listeners/files/files`);
const nts = require(`./electron/listeners/notes/notes`);
const bc = require(`./electron/listeners/blockchain/blockchain`);
const ghstTime = require(`./electron/listeners/ghost-time/ghost-time`);

// let configFolder = `${process.cwd()}/.ghost-config`;
// if (process.platform === 'darwin') {
//   configFolder = '/Applications/GhostDrive.app/Contents/Resources/.ghost-config';
// } else if (process.platform === 'win32') {
//   configFolder = `${process.cwd()}\\ghost-config`;
// }

//  mainWindow container
let mainWindow;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};

/**
 * Event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

//  main listener - on app start
app.on('ready', async () => {
  //  install extensions
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }
  //  main window settings
  mainWindow = new BrowserWindow({
    show: false,
    width: 1048,
    height: 600,
    minWidth: 1048,
    minHeight: 600
  });
  mainWindow.on('closed', () => {
    // if (cpkGlob) {
    //   utils.unmountFs(cpkGlob, fsUrlGlob, app.quit);
    // } else {
    app.quit();
    // }
  });
  mainWindow.loadURL(`file://${__dirname}/app.html`);
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });
  //  menu builder
  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});

//  common listeners
ipcMain.on('internet-connection:check', () => (
  isOnline()
    .then(online => mainWindow.webContents.send('internet-connection:status', online))
));

ipcMain.on('message-box:show', (event, options) => dialog.showMessageBox(options));

//  auth listeners
ipcMain.on('sign-up:start', (event, password) => {
  auth.signUp(password, (error, encryptedHex) => {
    if (error) return utils.errorHandler(error, mainWindow, 'sign-up');

    mainWindow.webContents.send('sign-up:success', encryptedHex);
  });
});

ipcMain.on('sign-in:start', (event, { password, filePath }) => {
  auth.signIn(password, filePath, (error, userData) => {
    if (error) return utils.errorHandler(error, mainWindow, 'sign-in');

    mainWindow.webContents.send('sign-in:success', userData);
  });
});

ipcMain.on('sign-out:start', (event, { userData, storageNodes }) => {
  auth.signOut(userData, storageNodes, (error, success) => {
    if (error) return utils.errorHandler(error, mainWindow, 'sign-out');

    mainWindow.webContents.send('sign-out:success', success);
  });
});

//  folders listeners
ipcMain.on('create-folder:start', (event, { name, parentFolder, userData, raftNode }) => {
  flds.createOne(name, parentFolder, userData, raftNode, (error, folder) => {
    if (error) return utils.errorHandler(error, mainWindow, 'create-folder');

    mainWindow.webContents.send('create-folder:success', folder);
  });
});

ipcMain.on('edit-folder:start', (event, { folder, userData, raftNode }) => {
  flds.editOne(folder, userData, raftNode, (error, theFolder) => {
    if (error) return utils.errorHandler(error, mainWindow, 'edit-folder');

    mainWindow.webContents.send('edit-folder:success', theFolder);
  });
});

ipcMain.on('remove-folders:start', (event, { folders, userData, raftNode }) => {
  flds.remove(folders, userData, raftNode, (error, files) => {
    if (error) return utils.errorHandler(error, mainWindow, 'remove-folders');

    mainWindow.webContents.send('remove-folders:success', { folders, files });
  });
});

//  files listeners
ipcMain.on('upload-files:start', (event, { files, userData, storageNodes, raftNode }) => {
  fls.upload(files, userData, storageNodes, raftNode, (error, theFiles) => {
    if (error) return utils.errorHandler(error, mainWindow, 'upload-files');

    mainWindow.webContents.send('upload-files:success', theFiles);
  });
});

ipcMain.on('download-file:start', (event, { signature, userData, raftNode }) => {
  fls.downloadOne(signature, userData, raftNode, (error, { name, base64File }) => {
    if (error) return utils.errorHandler(error, mainWindow, 'download-file');

    mainWindow.webContents.send('download-file:success', { name, base64File });
  });
});

ipcMain.on('remove-files:start', (event, { files, userData, raftNode }) => {
  fls.remove(files, userData, raftNode, (error, theFiles) => {
    if (error) return utils.errorHandler(error, mainWindow, 'remove-files');

    mainWindow.webContents.send('remove-files:success', theFiles);
  });
});

//  notes listeners
ipcMain.on('create-note:start', (event, { userData, raftNode }) => {
  nts.createOne(userData, raftNode, (error, note) => {
    if (error) return utils.errorHandler(error, mainWindow, 'create-note');

    mainWindow.webContents.send('create-note:success', note);
  });
});

ipcMain.on('edit-note:start', (event, { note, userData, raftNode }) => {
  nts.editOne(note, userData, raftNode, (error, theNote) => {
    if (error) return utils.errorHandler(error, mainWindow, 'edit-note');

    mainWindow.webContents.send('edit-note:success', theNote);
  });
});

ipcMain.on('remove-notes:start', (event, { notes, userData, raftNode }) => {
  nts.remove(notes, userData, raftNode, (error, theNotes) => {
    if (error) return utils.errorHandler(error, mainWindow, 'remove-notes');

    mainWindow.webContents.send('remove-notes:success', theNotes);
  });
});

//  blockchain listeners
ipcMain.on('create-transaction:start', (event, { userData, to, amount, bcNode }) => {
  bc.createTransaction(userData, to, amount, bcNode, (error, wallet) => {
    if (error) return utils.errorHandler(error, mainWindow, 'create-transaction');

    mainWindow.webContents.send('create-transaction:success', wallet);
  });
});

//  ghost-time listeners
ipcMain.on('set-ghost-time:start', (event, { kv, ghostTime, userData, raftNode }) => {
  ghstTime.set(kv, ghostTime, userData, raftNode, (error, updated) => {
    if (error) return utils.errorHandler(error, mainWindow, 'set-ghost-time');

    mainWindow.webContents.send('set-ghost-time:success', updated);
  });
});
