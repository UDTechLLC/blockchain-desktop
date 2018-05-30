import { ipcRenderer } from 'electron';
import * as actionTypes from './actionTypes';

//  get settings
const getAppSettingsStart = (userData, raftNode) => {
  ipcRenderer.send('app-settings:get', { userData, raftNode });
  return { type: actionTypes.GET_APP_SETTINGS_START };
};

const getAppSettingsSuccess = settings => ({
  type: actionTypes.GET_APP_SETTINGS_SUCCESS,
  settings
});

const getAppSettingsFail = () => ({
  type: actionTypes.GET_APP_SETTINGS_FAIL
});

export const getAppSettings = (userData, raftNode) => dispatch => {
  dispatch(getAppSettingsStart(userData, raftNode));
  ipcRenderer.once('app-settings:get-complete', (event, settings) => (
    dispatch(getAppSettingsSuccess(settings))
  ));
  ipcRenderer.once('app-settings:get-failed', () => dispatch(getAppSettingsFail()));
};

//  get all user data
const getUserDataStart = (userData, raftNode) => {
  ipcRenderer.send('user-data:get', { userData, raftNode });
  return { type: actionTypes.GET_USER_DATA_START };
};

const getUserDataSuccess = data => ({
  type: actionTypes.GET_USER_DATA_SUCCESS,
  data
});

const getUserDataFail = () => ({
  type: actionTypes.GET_USER_DATA_FAIL
});

export const getUserData = (userData, raftNode) => dispatch => {
  dispatch(getUserDataStart(userData, raftNode));
  ipcRenderer.once('user-data:get-complete', (event, data) => (
    dispatch(getUserDataSuccess(data))
  ));
  ipcRenderer.once('user-data:get-failed', () => dispatch(getUserDataFail()));
};

//  create new folder
const createNewFolderStart = (newFolderName, userData, raftNode) => {
  ipcRenderer.send('folder:create', { newFolderName, userData, raftNode });
  return { type: actionTypes.CREATE_NEW_FOLDER_START };
};

const createNewFolderSuccess = newFolder => ({
  type: actionTypes.CREATE_NEW_FOLDER_SUCCESS,
  newFolder
});

const createNewFolderFail = () => ({
  type: actionTypes.CREATE_NEW_FOLDER_FAIL
});

export const createNewFolder = (newFolderName, userData, raftNode) => dispatch => {
  dispatch(createNewFolderStart(newFolderName, userData, raftNode));
  ipcRenderer.once('folder:create-success', (event, newFolder) => (
    dispatch(createNewFolderSuccess(newFolder))
  ));
  ipcRenderer.once('folder:create-failed', () => dispatch(createNewFolderFail()));
};

//  edit folder name
const editFolderStart = (signature, newName, userData, raftNode) => {
  ipcRenderer.send('folder:edit', {
    signature,
    newName,
    userData,
    raftNode
  });
  return { type: actionTypes.EDIT_FOLDER_START };
};

const editFolderSuccess = (signature, newName) => ({
  type: actionTypes.EDIT_FOLDER_SUCCESS,
  signature,
  newName
});

const editFolderFail = () => ({
  type: actionTypes.EDIT_FOLDER_FAIL
});

export const editFolder = (signature, newName, userData, raftNode) => dispatch => {
  dispatch(editFolderStart(signature, newName, userData, raftNode));
  ipcRenderer.once('folder:edit-success', () => (
    dispatch(editFolderSuccess(signature, newName))
  ));
  ipcRenderer.once('folder:edit-failed', () => dispatch(editFolderFail()));
};

//  delete folder
const deleteFolderStart = (folderId, userData, raftNode) => {
  ipcRenderer.send('folder:delete', { folderId, userData, raftNode });
  return { type: actionTypes.DELETE_FOLDER_START };
};

const deleteFolderSuccess = folderId => ({
  type: actionTypes.DELETE_FOLDER_SUCCESS,
  folderId
});

const deleteFolderFail = () => ({
  type: actionTypes.DELETE_FOLDER_FAIL
});

export const deleteFolder = (folderId, userData, raftNode) => dispatch => {
  dispatch(deleteFolderStart(folderId, userData, raftNode));
  ipcRenderer.once('folder:delete-success', () => dispatch(deleteFolderSuccess(folderId)));
  ipcRenderer.once('folder:delete-failed', () => dispatch(deleteFolderFail()));
};

//  upload new files
const uploadFilesStart = (userData, files, storageNodes, raftNode) => {
  ipcRenderer.send('files:upload', {
    userData,
    files,
    storageNodes,
    raftNode
  });
  return { type: actionTypes.UPLOAD_FILES_START };
};

const uploadFilesSuccess = filesList => ({
  type: actionTypes.UPLOAD_FILES_SUCCESS,
  filesList
});

const uploadFilesFail = () => ({
  type: actionTypes.UPLOAD_FILES_FAIL
});

export const uploadFiles = (userData, files, storageNodes, raftNode) => dispatch => {
  dispatch(uploadFilesStart(userData, files, storageNodes, raftNode));
  ipcRenderer.once('files:upload-success', (event, filesList) => dispatch(uploadFilesSuccess(filesList)));
  ipcRenderer.once('files:upload-failed', () => dispatch(uploadFilesFail()));
};

//  download file
const downloadFileStart = (signature, userData, raftNode) => {
  ipcRenderer.send('file:download', { signature, userData, raftNode });
  return { type: actionTypes.DOWNLOAD_FILE_START };
};

const downloadFileSuccess = (signature, base64File) => ({
  type: actionTypes.DOWNLOAD_FILE_SUCCESS,
  signature,
  base64File
});

const downloadFileFail = () => ({
  type: actionTypes.DOWNLOAD_FILE_FAIL
});

export const downloadFile = (signature, userData, raftNode) => dispatch => {
  dispatch(downloadFileStart(signature, userData, raftNode));
  ipcRenderer.once('file:download-success', (event, base64File) => (
    dispatch(downloadFileSuccess(signature, base64File))
  ));
  ipcRenderer.once('file:download-failed', () => dispatch(downloadFileFail()));
};

export const saveDownloadedFile = () => ({
  type: actionTypes.SAVE_DOWNLOADED_FILE
});

//  delete file
const removeFileStart = (signature, userData, raftNode) => {
  ipcRenderer.send('file:remove', { signature, userData, raftNode });
  return { type: actionTypes.REMOVE_FILE_START };
};

const removeFileSuccess = signature => ({
  type: actionTypes.REMOVE_FILE_SUCCESS,
  signature
});

const removeFileFail = () => ({
  type: actionTypes.REMOVE_FILE_FAIL
});

export const removeFile = (signature, userData, raftNode) => dispatch => {
  dispatch(removeFileStart(signature, userData, raftNode));
  ipcRenderer.once('file:remove-success', () => dispatch(removeFileSuccess(signature)));
  ipcRenderer.once('file:remove-failed', () => dispatch(removeFileFail()));
};

// create note
const createNoteStart = (userData, raftNode) => {
  ipcRenderer.send('note:create', { userData, raftNode });
  return { type: actionTypes.CREATE_NOTE_START };
};

const createNoteSuccess = newNote => ({
  type: actionTypes.CREATE_NOTE_SUCCESS,
  newNote
});

const createNoteFail = () => ({
  type: actionTypes.CREATE_NOTE_FAIL
});

export const createNote = (userData, raftNode) => dispatch => {
  dispatch(createNoteStart(userData, raftNode));
  ipcRenderer.once('note:create-success', (event, newNote) => (
    dispatch(createNoteSuccess(newNote))
  ));
  ipcRenderer.once('note:create-failed', () => dispatch(createNoteFail()));
};

//  edit note
const editNoteStart = (signature, noteUpdateData, userData, raftNode) => {
  ipcRenderer.send('note:edit', {
    signature,
    noteUpdateData,
    userData,
    raftNode
  });
  return { type: actionTypes.EDIT_NOTE_START };
};

const editNoteSuccess = (signature, noteUpdateData) => ({
  type: actionTypes.EDIT_NOTE_SUCCESS,
  signature,
  noteUpdateData
});

const editNoteFail = () => ({
  type: actionTypes.EDIT_NOTE_FAIL
});

export const editNote = (signature, noteUpdateData, userData, raftNode) => dispatch => {
  dispatch(editNoteStart(signature, noteUpdateData, userData, raftNode));
  ipcRenderer.once('note:edit-success', () => (
    dispatch(editNoteSuccess(signature, noteUpdateData))
  ));
  ipcRenderer.once('note:edit-failed', () => dispatch(editNoteFail()));
};

//  remove note
const removeNoteStart = (signature, userData, raftNode) => {
  ipcRenderer.send('note:remove', { signature, userData, raftNode });
  return { type: actionTypes.REMOVE_NOTE_START };
};

const removeNoteSuccess = signature => ({
  type: actionTypes.REMOVE_NOTE_SUCCESS,
  signature
});

const removeNoteFail = () => ({
  type: actionTypes.REMOVE_NOTE_FAIL
});

export const removeNote = (signature, userData, raftNode) => dispatch => {
  dispatch(removeNoteStart(signature, userData, raftNode));
  ipcRenderer.once('note:remove-success', () => (
    dispatch(removeNoteSuccess(signature))
  ));
  ipcRenderer.once('note:remove-failed', () => dispatch(removeNoteFail()));
};
