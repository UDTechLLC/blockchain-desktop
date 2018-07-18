import { ipcRenderer } from 'electron';
import { saveAs } from 'file-saver';

import * as actionTypes from './actionTypes';

const regStart = () => ({ type: actionTypes.REGISTRATION_START });

const regSuccess = encryptedHex => dispatch => {
  const blob = new Blob([encryptedHex], {
    type: 'text/plain'
  });
  dispatch(saveAs(blob, 'credentials.bak'));

  return { type: actionTypes.REGISTRATION_SUCCESS };
};

const regFail = error => ({
  type: actionTypes.REGISTRATION_FAIL,
  error
});

export const regCleanUp = () => ({ type: actionTypes.REGISTRATION_CLEAN_UP });

export const registration = password => dispatch => {
  dispatch(regStart());
  ipcRenderer.send('sign-up:start', password);
  ipcRenderer.once('sign-up:success', (event, encryptedHex) => dispatch(regSuccess(encryptedHex)));
  ipcRenderer.once('sign-up:fail', (event, error) => dispatch(regFail(error)));
};

const authStart = () => ({ type: actionTypes.AUTH_START });

const authSuccess = data => ({
  type: actionTypes.AUTH_SUCCESS,
  userData: data.userData,
  digestInfo: data.digestInfo,
  folders: data.folders,
  files: data.files,
  notes: data.notes
});

const authFail = error => ({
  type: actionTypes.AUTH_FAIL,
  error
});

export const auth = (password, filePath) => dispatch => {
  dispatch(authStart());
  ipcRenderer.send('sign-in:start', { password, filePath });
  ipcRenderer.once('sign-in:success', (event, userData) => dispatch(authSuccess(userData)));
  ipcRenderer.once('sign-in:fail', (event, error) => dispatch(authFail(error)));
};

const logoutStart = () => ({ type: actionTypes.LOGOUT_START });

const logoutSuccess = () => ({ type: actionTypes.LOGOUT_SUCCESS });

const logoutFail = error => ({
  type: actionTypes.LOGOUT_FAIL,
  error
});

export const logout = (userData, storageNodes = undefined) => dispatch => {
  dispatch(logoutStart());
  if (storageNodes && storageNodes.length) {
    ipcRenderer.send('sign-out:start', { userData, storageNodes });
    ipcRenderer.once('sign-out:success', () => dispatch(logoutSuccess()));
    ipcRenderer.once('sign-out:fail', (event, error) => dispatch(logoutFail(error)));
  } else {
    dispatch(logoutSuccess());
  }
};
