/* eslint-disable global-require,object-curly-newline */
/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./listeners/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { requireTaskPool } = require('electron-remote');

const MenuBuilder = require('./menu');
const utils = require('./electron/utils/utils');

const auth = requireTaskPool(require.resolve('./electron/listeners/auth/auth'));
const flds = requireTaskPool(require.resolve('./electron/listeners/folders/folders'));
const fls = requireTaskPool(require.resolve('./electron/listeners/files/files'));
const nts = requireTaskPool(require.resolve('./electron/listeners/notes/notes'));
const ghstTime = requireTaskPool(require.resolve('./electron/listeners/ghost-time/ghost-time'));

// let configFolder = `${process.cwd()}/.wizeconfig`;
// if (process.platform === 'darwin') {
//   configFolder = '/Applications/Wizebit.listeners/Contents/Resources/.wizeconfig';
// } else if (process.platform === 'win32') {
//   configFolder = `${process.cwd()}\\wizeconfig`;
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

//  main listener - on listeners start
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
    //   utils.unmountFs(cpkGlob, fsUrlGlob, listeners.quit);
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

//  auth listeners
ipcMain.on('sign-up:start', async (event, password) => {
  try {
    const encryptedHex = await auth.signUp(password);
    mainWindow.webContents.send('sign-up:success', encryptedHex);
  } catch (e) {
    utils.errorHandler(e, mainWindow, 'sign-up');
  }
});

ipcMain.on('sign-in:start', async (event, { password, filePath }) => {
  try {
    const userData = await auth.signIn(password, filePath);
    mainWindow.webContents.send('sign-in:success', userData);
  } catch (e) {
    utils.errorHandler(e, mainWindow, 'sign-in');
  }
});

ipcMain.on('sign-out:start', async (event, { userData, storageNodes }) => {
  try {
    const success = await auth.signOut(userData, storageNodes);
    mainWindow.webContents.send('sign-out:success', success);
  } catch (e) {
    utils.errorHandler(e, mainWindow, 'sign-out');
  }
});

//  folders listeners
ipcMain.on('create-folder:start', async (event, { name, parentFolder, userData, raftNode }) => {
  try {
    const folder = await flds.createOne(name, parentFolder, userData, raftNode);
    mainWindow.webContents.send('create-folder:success', folder);
  } catch (e) {
    utils.errorHandler(e, mainWindow, 'create-folder');
  }
});

ipcMain.on('edit-folder:start', async (event, { folder, userData, raftNode }) => {
  try {
    const theFolder = await flds.editOne(folder, userData, raftNode);
    mainWindow.webContents.send('create-folder:success', theFolder);
  } catch (e) {
    utils.errorHandler(e, mainWindow, 'edit-folder');
  }
});

ipcMain.on('remove-folders:start', async (event, { folders, userData, raftNode }) => {
  try {
    const files = await flds.remove(folders, userData, raftNode);
    mainWindow.webContents.send('create-folder:success', { folders, files });
  } catch (e) {
    utils.errorHandler(e, mainWindow, 'remove-folders');
  }
});

//  files listeners
ipcMain.on('upload-files:start', async (event, { files, userData, storageNodes, raftNode }) => {
  try {
    const theFiles = await fls.upload(files, userData, storageNodes, raftNode);
    mainWindow.webContents.send('upload-files:success', theFiles);
  } catch (e) {
    utils.errorHandler(e, mainWindow, 'upload-files');
  }
});

ipcMain.on('download-file:start', async (event, { signature, userData, raftNode }) => {
  try {
    const { name, base64File } = await fls.downloadOne(signature, userData, raftNode);
    mainWindow.webContents.send('download-file:success', { name, base64File });
  } catch (e) {
    utils.errorHandler(e, mainWindow, 'download-file');
  }
});

ipcMain.on('remove-files:start', async (event, { files, userData, raftNode }) => {
  try {
    const theFiles = await fls.remove(files, userData, raftNode);
    mainWindow.webContents.send('create-files:success', theFiles);
  } catch (e) {
    utils.errorHandler(e, mainWindow, 'remove-files');
  }
});

//  notes listeners
ipcMain.on('create-note:start', async (event, { userData, raftNode }) => {
  try {
    const note = await nts.createOne(userData, raftNode);
    mainWindow.webContents.send('note-create:success', note);
  } catch (e) {
    utils.errorHandler(e, mainWindow, 'note-create');
  }
});

ipcMain.on('edit-note:start', async (event, { note, userData, raftNode }) => {
  try {
    const theNote = await nts.editOne(note, userData, raftNode);
    mainWindow.webContents.send('edit-note:success', theNote);
  } catch (e) {
    utils.errorHandler(e, mainWindow, 'edit-note');
  }
});

ipcMain.on('remove-files:start', async (event, { files, userData, raftNode }) => {
  try {
    const theFiles = await fls.remove(files, userData, raftNode);
    mainWindow.webContents.send('create-files:success', theFiles);
  } catch (e) {
    utils.errorHandler(e, mainWindow, 'remove-files');
  }
});

//  ghost-time listeners
ipcMain.on('set-ghost-time:start', async (event, { kv, ghostTime, userData, raftNode }) => {
  try {
    const updated = await ghstTime.set(kv, ghostTime, userData, raftNode);
    mainWindow.webContents.send('set-ghost-time:success', updated);
  } catch (e) {
    utils.errorHandler(e, mainWindow, 'set-ghost-time');
  }
});
