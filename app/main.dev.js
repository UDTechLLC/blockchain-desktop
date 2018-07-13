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
const { app, BrowserWindow, ipcMain } = require('electron');
const { requireTaskPool } = require('electron-remote');

const MenuBuilder = require('./menu');
const utils = require('./electron/utils/utils');

const auth = requireTaskPool(require.resolve('./electron/app/auth/auth'));
const flds = requireTaskPool(require.resolve('./electron/app/folders/folders'));

// const CommonListeners = require('./electron/app/common');
// const Digest = require('./electron/app/digest');
// const FS = require('./electron/app/filesystem');
// const Raft = require('./electron/app/raft');
// const FilesListeners = require('./electron/app/files');
// const BlockChain = require('./electron/app/blockchain');
// const GhostPad = require('./electron/app/notes');

// let configFolder = `${process.cwd()}/.wizeconfig`;
// if (process.platform === 'darwin') {
//   configFolder = '/Applications/Wizebit.app/Contents/Resources/.wizeconfig';
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
  //  common
  // CommonListeners(mainWindow, configFolder);
  //  digest
  // Digest(mainWindow);
  //  raft
  // Raft(mainWindow);
  //  file system listeners
  // FS(mainWindow, cpkGlob, fsUrlGlob);
  // //  files listeners
  // FilesListeners(mainWindow);
  //  blockchain listeners
  // BlockChain(mainWindow);
  // //  notes listeners
  // GhostPad(mainWindow);
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
// eslint-disable-next-line object-curly-newline
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
