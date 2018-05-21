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

export const getAppSettings = (userData, raftNode) => dispatch => {
  dispatch(getAppSettingsStart(userData, raftNode));
  ipcRenderer.once('app-settings:get-complete', (event, settings) => (
    dispatch(getAppSettingsSuccess(settings))
  ));
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

export const getUserData = (userData, raftNode) => dispatch => {
  dispatch(getUserDataStart(userData, raftNode));
  ipcRenderer.once('user-data:get-complete', (event, data) => (
    dispatch(getUserDataSuccess(data))
  ));
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

export const createNewFolder = (newFolderName, userData, raftNode) => dispatch => {
  dispatch(createNewFolderStart(newFolderName, userData, raftNode));
  ipcRenderer.once('folder:create-success', (event, newFolder) => (
    dispatch(createNewFolderSuccess(newFolder))
  ));
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

export const deleteFolder = (folderId, userData, raftNode) => dispatch => {
  dispatch(deleteFolderStart(folderId, userData, raftNode));
  ipcRenderer.once('folder:delete-success', () => dispatch(deleteFolderSuccess(folderId)));
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

export const uploadFiles = (userData, files, storageNodes, raftNode) => dispatch => {
  dispatch(uploadFilesStart(userData, files, storageNodes, raftNode));
  ipcRenderer.once('files:upload-success', (event, filesList) => dispatch(uploadFilesSuccess(filesList)));
};

// TODO: Refactoring of notes actions
const editNotesListStart = (notes, userData, raftNode) => {
  ipcRenderer.send('notes:edit-list', { notes, userData, raftNode });
  return { type: actionTypes.EDIT_NOTE_LIST_START };
};

const editNotesListSuccess = notes => ({
  type: actionTypes.EDIT_NOTE_LIST_SUCCESS,
  notes
});

export const editNotesList = (notes, userData, raftNode) => dispatch => {
  dispatch(editNotesListStart(notes, userData, raftNode));
  ipcRenderer.once('notes:edit-list-complete', () => (
    dispatch(editNotesListSuccess(notes))
  ));
};

const deleteNoteStart = (id, userData, raftNode) => {
  ipcRenderer.send('note:delete', { id, userData, raftNode });
  return { type: actionTypes.DELETE_NOTE_START };
};

const deleteNoteSuccess = id => ({
  type: actionTypes.DELETE_NOTE_SUCCESS,
  id
});

export const deleteNote = (id, userData, raftNode) => dispatch => {
  dispatch(deleteNoteStart(id, userData, raftNode));
  ipcRenderer.once('delete-note:delete-complete', () => (
    dispatch(deleteNoteSuccess(id))
  ));
};
