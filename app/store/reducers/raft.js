import _ from 'lodash';
import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utils/utils';
import { ROOT_HASH } from '../../utils/const';

const initialState = {
  settings: {
    loginMethod: {
      pinCode: false,
      wize_2Fa: false,
      password: false
    },
    nodeStaking: {
      timeLock: false,
      masternodes: false,
      supernodes: false
    },
    dataSettings: {
      _3Clones: false,
      superEncryption: false,
      shareFiles: false
    },
    encryption: {
      sha1028: false,
      hashEncryption: false,
      secureTonels: false
    },
    securityLayers: {
      pin: false,
      wize_2Fa: false,
      voiceBiometric: false,
      faceRecognition: false,
      musicSlider: false
    }
  },
  folders: {},
  files: {},
  notes: {},
  error: undefined,
  loading: false
};

const actionStart = state => (updateObject(state, { loading: true }));

const actionFail = (state, action) => (updateObject(state, {
  error: action.error,
  loading: false
}));

const authSuccess = (state, action) => (updateObject(state, {
  folders: {
    [ROOT_HASH]: {
      id: ROOT_HASH,
      name: 'Root',
      parentFolder: null,
      timestamp: 0,
      securityLayers: {
        _2fa: false,
        pin: false,
        key: false,
        voice: false
      }
    },
    ...action.folders
  },
  files: action.files,
  notes: action.notes,
  loading: false
}));

const authFail = (state, action) => (updateObject(state, {
  folders: {
    [ROOT_HASH]: {
      id: ROOT_HASH,
      name: 'Root',
      parentFolder: null,
      timestamp: 0,
      securityLayers: {
        _2fa: false,
        pin: false,
        key: false,
        voice: false
      }
    }
  },
  files: {},
  notes: {},
  error: action.error,
  loading: false
}));

const authLogout = state => (updateObject(state, {
  folders: {
    [ROOT_HASH]: {
      id: ROOT_HASH,
      name: 'Root',
      parentFolder: null,
      timestamp: 0,
      securityLayers: {
        _2fa: false,
        pin: false,
        key: false,
        voice: false
      }
    }
  },
  files: {},
  notes: {},
  loading: false
}));

const createNewFolderSuccess = (state, action) => (updateObject(state, {
  folders: { ...state.folders, ...action.folders },
  loading: false
}));

const deleteFolderSuccess = (state, action) => (updateObject(state, {
  folders: _.omitBy(state.folders, (v, k) => (
    Object.keys(action.folders).includes(k)
  )),
  files: _.omitBy(state.files, (v, k) => (
    Object.keys(action.files).includes(k)
  )),
  loading: false
}));

const editFolderSuccess = (state, action) => (updateObject(state, {
  folders: { ...state.folders, ...action.folders },
  loading: false
}));

const uploadFilesSuccess = (state, action) => (updateObject(state, {
  files: { ...state.files, ...action.files },
  loading: false
}));

const downloadFileSuccess = state => (updateObject(state, {
  loading: false
}));

const removeFileSuccess = (state, action) => (updateObject(state, {
  files: _.omitBy(state.files, (v, k) => (
    Object.keys(action.files).includes(k)
  )),
  loading: false
}));

const setGhostTimeSuccess = (state, action) => (updateObject(state, {
  [action.key]: {
    ...state[action.key],
    ...action.data
  },
  loading: false
}));

const createNoteSuccess = (state, action) => (updateObject(state, {
  notes: { ...state.notes, ...action.note },
  loading: false
}));

const updateNoteSuccess = (state, action) => (updateObject(state, {
  notes: { ...state.notes, ...action.note },
  loading: false
}));

const removeNotesSuccess = (state, action) => (updateObject(state, {
  notes: _.omitBy(state.notes, (v, k) => (
    Object.keys(action.notes).includes(k)
  )),
  loading: false
}));

const reducer = (state = initialState, action) => {
  if (action) {
    switch (action.type) {
      //  start actions
      case actionTypes.AUTH_START:
      case actionTypes.CREATE_NEW_FOLDER_START:
      case actionTypes.EDIT_FOLDER_START:
      case actionTypes.REMOVE_FOLDERS_START:
      case actionTypes.UPLOAD_FILES_START:
      case actionTypes.DOWNLOAD_FILE_START:
      case actionTypes.REMOVE_FILES_START:
      case actionTypes.CREATE_NOTE_START:
      case actionTypes.EDIT_NOTE_START:
      case actionTypes.REMOVE_NOTES_START:
      case actionTypes.SET_GHOST_TIME_START:
        return actionStart(state, action);
      //  fail actions
      case actionTypes.AUTH_FAIL:
        return authFail(state, action);
      case actionTypes.CREATE_NEW_FOLDER_FAIL:
      case actionTypes.EDIT_FOLDER_FAIL:
      case actionTypes.REMOVE_FOLDERS_FAIL:
      case actionTypes.UPLOAD_FILES_FAIL:
      case actionTypes.DOWNLOAD_FILE_FAIL:
      case actionTypes.REMOVE_FILES_FAIL:
      case actionTypes.CREATE_NOTE_FAIL:
      case actionTypes.EDIT_NOTE_FAIL:
      case actionTypes.REMOVE_NOTES_FAIL:
      case actionTypes.SET_GHOST_TIME_FAIL:
        return actionFail(state, action);
      //  success actions
      case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
      case actionTypes.LOGOUT_SUCCESS: return authLogout(state, action);
      case actionTypes.CREATE_NEW_FOLDER_SUCCESS: return createNewFolderSuccess(state, action);
      case actionTypes.EDIT_FOLDER_SUCCESS: return editFolderSuccess(state, action);
      case actionTypes.REMOVE_FOLDERS_SUCCESS: return deleteFolderSuccess(state, action);
      case actionTypes.UPLOAD_FILES_SUCCESS: return uploadFilesSuccess(state, action);
      case actionTypes.DOWNLOAD_FILE_SUCCESS: return downloadFileSuccess(state, action);
      case actionTypes.REMOVE_FILES_SUCCESS: return removeFileSuccess(state, action);
      case actionTypes.CREATE_NOTE_SUCCESS: return createNoteSuccess(state, action);
      case actionTypes.EDIT_NOTE_SUCCESS: return updateNoteSuccess(state, action);
      case actionTypes.REMOVE_NOTES_SUCCESS: return removeNotesSuccess(state, action);
      case actionTypes.SET_GHOST_TIME_SUCCESS: return setGhostTimeSuccess(state, action);
      default: return state;
    }
  }

  return state;
};

export default reducer;
