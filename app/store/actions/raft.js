import _ from 'lodash';
import { saveAs } from 'file-saver';
import { ipcRenderer } from 'electron';

import * as actionTypes from './actionTypes';
import * as utils from './../../utils/utils';

// //  get settings
// const getAppSettingsStart = (userData, raftNode) => {
//   ipcRenderer.send('app-settings:get', { userData, raftNode });
//   return { type: actionTypes.GET_APP_SETTINGS_START };
// };
//
// const getAppSettingsSuccess = settings => ({
//   type: actionTypes.GET_APP_SETTINGS_SUCCESS,
//   settings
// });
//
// const getAppSettingsFail = () => ({
//   type: actionTypes.GET_APP_SETTINGS_FAIL
// });
//
// export const getAppSettings = (userData, raftNode) => dispatch => {
//   dispatch(getAppSettingsStart(userData, raftNode));
//   ipcRenderer.once('app-settings:get-complete', (event, settings) => (
//     dispatch(getAppSettingsSuccess(settings))
//   ));
//   ipcRenderer.once('app-settings:get-failed', () => dispatch(getAppSettingsFail()));
// };

//  create new folder
const createNewFolderStart = () => ({ type: actionTypes.CREATE_NEW_FOLDER_START });

const createNewFolderSuccess = folder => ({
  type: actionTypes.CREATE_NEW_FOLDER_SUCCESS,
  folder
});

const createNewFolderFail = error => ({
  type: actionTypes.CREATE_NEW_FOLDER_FAIL,
  error
});

export const createNewFolder = (name, userData, raftNode) => dispatch => {
  dispatch(createNewFolderStart());
  ipcRenderer.send('create-folder:start', { name, parentFolder: 'Root', userData, raftNode });
  ipcRenderer.once('create-folder:success', (event, folder) => (
    dispatch(createNewFolderSuccess(folder))
  ));
  ipcRenderer.once('create-folder:fail', (event, error) => dispatch(createNewFolderFail(error)));
};

//  edit folder name
const editFolderStart = () => ({ type: actionTypes.EDIT_FOLDER_START });

const editFolderSuccess = folder => ({
  type: actionTypes.EDIT_FOLDER_SUCCESS,
  folder
});

const editFolderFail = error => ({
  type: actionTypes.EDIT_FOLDER_FAIL,
  error
});

export const editFolder = (folder, userData, raftNode) => dispatch => {
  dispatch(editFolderStart());
  ipcRenderer.send('edit-folder:start', { folder, userData, raftNode });
  ipcRenderer.once('edit-folder:success', (event, theFolder) => (
    dispatch(editFolderSuccess(theFolder))
  ));
  ipcRenderer.once('edit-folder:fail', (event, error) => dispatch(editFolderFail(error)));
};

//  remove folder
const removeFoldersStart = () => ({ type: actionTypes.REMOVE_FOLDERS_START });

const removeFoldersSuccess = (folders, files) => ({
  type: actionTypes.REMOVE_FOLDERS_SUCCESS,
  folders,
  files
});

const removeFoldersFail = error => ({
  type: actionTypes.REMOVE_FOLDERS_FAIL,
  error
});

export const removeFolders = (folders, userData, raftNode) => dispatch => {
  dispatch(removeFoldersStart());
  ipcRenderer.send('remove-folders:start', { folders, userData, raftNode });
  ipcRenderer.once('remove-folders:success', (event, data) => (
    dispatch(removeFoldersSuccess(data.folders, data.files))
  ));
  ipcRenderer.once('remove-folders:fail', (event, error) => dispatch(removeFoldersFail(error)));
};

//  upload new files
const uploadFilesStart = () => ({ type: actionTypes.UPLOAD_FILES_START });

const uploadFilesSuccess = files => ({
  type: actionTypes.UPLOAD_FILES_SUCCESS,
  files
});

const uploadFilesFail = error => ({
  type: actionTypes.UPLOAD_FILES_FAIL,
  error
});

export const uploadFiles = (files, userData, storageNodes, raftNode) => dispatch => {
  dispatch(uploadFilesStart());
  ipcRenderer.send('upload-files:start', { files, userData, storageNodes, raftNode });
  ipcRenderer.once('upload-files:success', (event, theFiles) => (
    dispatch(uploadFilesSuccess(theFiles))
  ));
  ipcRenderer.once('upload-files:fail', (event, error) => dispatch(uploadFilesFail(error)));
};

//  download file
const downloadFileStart = () => ({ type: actionTypes.DOWNLOAD_FILE_START });

const downloadFileSuccess = (name, base64File) => dispatch => {
  const blob = utils.b64toBlob(base64File);
  dispatch(saveAs(blob, name));

  return { type: actionTypes.DOWNLOAD_FILE_SUCCESS };
};

const downloadFileFail = error => ({
  type: actionTypes.DOWNLOAD_FILE_FAIL,
  error
});

export const downloadFile = (signature, userData, raftNode) => dispatch => {
  dispatch(downloadFileStart());
  ipcRenderer.send('download-file:start', { signature, userData, raftNode });
  ipcRenderer.once('download-file:success', (event, base64File) => (
    dispatch(downloadFileSuccess(signature, { name, base64File }))
  ));
  ipcRenderer.once('download-file:fail', (event, error) => dispatch(downloadFileFail(error)));
};

//  delete file
const removeFilesStart = () => ({ type: actionTypes.REMOVE_FILES_START });

const removeFilesSuccess = files => ({
  type: actionTypes.REMOVE_FILES_SUCCESS,
  files
});

const removeFilesFail = error => ({
  type: actionTypes.REMOVE_FILES_FAIL,
  error
});

export const removeFiles = (files, userData, raftNode) => dispatch => {
  dispatch(removeFilesStart());
  ipcRenderer.send('remove-files:start', { files, userData, raftNode });
  ipcRenderer.once('remove-files:success', (event, theFiles) => (
    dispatch(removeFilesSuccess(theFiles))
  ));
  ipcRenderer.once('remove-files:fail', (event, error) => dispatch(removeFilesFail(error)));
};

// create note
const createNoteStart = () => ({ type: actionTypes.CREATE_NOTE_START });

const createNoteSuccess = note => ({
  type: actionTypes.CREATE_NOTE_SUCCESS,
  note
});

const createNoteFail = error => ({
  type: actionTypes.CREATE_NOTE_FAIL,
  error
});

export const createNote = (userData, raftNode) => dispatch => {
  dispatch(createNoteStart());
  ipcRenderer.send('create-note:start', { userData, raftNode });
  ipcRenderer.once('create-note:success', (event, note) => (
    dispatch(createNoteSuccess(note))
  ));
  ipcRenderer.once('create-note:fail', (event, error) => dispatch(createNoteFail(error)));
};

//  edit note
const editNoteStart = () => ({ type: actionTypes.EDIT_NOTE_START });

const editNoteSuccess = note => ({
  type: actionTypes.EDIT_NOTE_SUCCESS,
  note
});

const editNoteFail = error => ({
  type: actionTypes.EDIT_NOTE_FAIL,
  error
});

export const editNote = (note, userData, raftNode) => dispatch => {
  dispatch(editNoteStart());
  ipcRenderer.send('edit-note:start', { note, userData, raftNode });
  ipcRenderer.once('edit-note:success', (event, theNote) => (
    dispatch(editNoteSuccess(theNote))
  ));
  ipcRenderer.once('edit-note:fail', (event, error) => dispatch(editNoteFail(error)));
};

//  remove note
const removeNotesStart = () => ({ type: actionTypes.REMOVE_NOTES_START });

const removeNotesSuccess = notes => ({
  type: actionTypes.REMOVE_NOTES_SUCCESS,
  notes
});

const removeNotesFail = error => ({
  type: actionTypes.REMOVE_NOTES_FAIL,
  error
});

export const removeNotes = (notes, userData, raftNode) => dispatch => {
  dispatch(removeNotesStart());
  ipcRenderer.send('remove-notes:start', { notes, userData, raftNode });
  ipcRenderer.once('remove-notes:success', (event, theNotes) => (
    dispatch(removeNotesSuccess(theNotes))
  ));
  ipcRenderer.once('remove-notes:fail', (event, error) => dispatch(removeNotesFail(error)));
};

//  ghost time
const setGhostTimeStart = () => ({ type: actionTypes.SET_GHOST_TIME_START });

const setGhostTimeSuccess = updated => {
  const key = _.findKey(updated, o => !_.isEmpty(o));
  const data = _.mapValues(updated[key], o => o);

  return {
    type: actionTypes.SET_GHOST_TIME_SUCCESS,
    key,
    data
  };
};

const setGhostTimeFail = error => ({
  type: actionTypes.SET_GHOST_TIME_FAIL,
  error
});

export const setGhostTime = (obj2Upd, ghostTime, userData, raftNode) => dispatch => {
  dispatch(setGhostTimeStart());
  const kv = {
    folders: {},
    files: {},
    notes: {},
    ...obj2Upd
  };
  ipcRenderer.send('set-ghost-time:start', { kv, ghostTime, raftNode });
  ipcRenderer.once('set-ghost-time:success', (event, updated) => (
    dispatch(setGhostTimeSuccess(updated))
  ));
  ipcRenderer.once('set-ghost-time:fail', (event, error) => dispatch(setGhostTimeFail(error)));
};
