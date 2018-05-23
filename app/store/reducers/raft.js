import _ from 'lodash';
import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utils/utility';

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
  folders: {
    '175aeb081e74c9116ac7f6677c874ff6963ce1f5': {
      parentFolder: null,
      name: 'root',
      date: 0,
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
  downloadedFile: {
    signature: '',
    name: '',
    base64File: '',
    downloaded: true
  },
  error: null,
  loading: false
};

// const actionStart = state => (updateObject(state, {
//   loading: true
// }));
//
// const getNotes = (state, action) => (updateObject(state, {
//   notes: action.notes,
//   loading: false
// }));
//
// const editNotesList = (state, action) => (updateObject(state, {
//   notes: [...action.notes],
//   loading: false
// }));
//
// const deleteNote = (state, action) => (updateObject(state, {
//   notes: state.notes.filter(el => el.id !== action.id),
//   loading: false
// }));

const actionStart = state => (updateObject(state, {
  loading: true
}));

const getAppSettingsSuccess = (state, action) => (updateObject(state, {
  settings: {
    ...state.settings,
    ...action.settings
  },
  loading: false
}));

const getUserDataSuccess = (state, action) => (updateObject(state, {
  folders: {
    ...state.folders,
    ...action.data.folders
  },
  files: {
    ...state.files,
    ...action.data.files
  },
  notes: {
    ...state.notes,
    ...action.data.notes
  },
  loading: false
}));

const createNewFolderSuccess = (state, action) => (updateObject(state, {
  folders: {
    ...state.folders,
    ...action.newFolder
  },
  loading: false
}));

const deleteFolderSuccess = (state, action) => (updateObject(state, {
  folders: _.pickBy(state.folders, (v, k) => k !== action.folderId),
  loading: false
}));

const uploadFilesSuccess = (state, action) => (updateObject(state, {
  files: action.filesList,
  loading: false
}));

const downloadFileSuccess = (state, action) => (updateObject(state, {
  downloadedFile: {
    signature: action.signature,
    base64File: action.base64File,
    name: state.files[action.signature].name,
    downloaded: false
  },
  loading: false
}));

const saveDownloadedFile = state => (updateObject(state, {
  downloadedFile: {
    ...state.downloadedFile,
    downloaded: !state.downloadedFile.downloaded
  }
}));

const removeFileSuccess = (state, action) => (updateObject(state, {
  files: _.pickBy(state.files, (v, k) => k !== action.signature),
  loading: false
}));

const reducer = (state = initialState, action) => {
  if (action) {
    switch (action.type) {
      case actionTypes.GET_APP_SETTINGS_START: return actionStart(state, action);
      case actionTypes.GET_APP_SETTINGS_SUCCESS: return getAppSettingsSuccess(state, action);
      case actionTypes.GET_USER_DATA_START: return actionStart(state, action);
      case actionTypes.GET_USER_DATA_SUCCESS: return getUserDataSuccess(state, action);
      case actionTypes.CREATE_NEW_FOLDER_START: return actionStart(state, action);
      case actionTypes.CREATE_NEW_FOLDER_SUCCESS: return createNewFolderSuccess(state, action);
      case actionTypes.DELETE_FOLDER_START: return actionStart(state, action);
      case actionTypes.DELETE_FOLDER_SUCCESS: return deleteFolderSuccess(state, action);
      case actionTypes.UPLOAD_FILES_START: return actionStart(state, action);
      case actionTypes.UPLOAD_FILES_SUCCESS: return uploadFilesSuccess(state, action);
      case actionTypes.DOWNLOAD_FILE_START: return actionStart(state, action);
      case actionTypes.DOWNLOAD_FILE_SUCCESS: return downloadFileSuccess(state, action);
      case actionTypes.SAVE_DOWNLOADED_FILE: return saveDownloadedFile(state, action);
      case actionTypes.REMOVE_FILE_START: return actionStart(state, action);
      case actionTypes.REMOVE_FILE_SUCCESS: return removeFileSuccess(state, action);
      // case actionTypes.GET_NOTES_START: return actionStart(state, action);
      // case actionTypes.GET_NOTES_SUCCESS: return getNotes(state, action);
      // case actionTypes.EDIT_NOTE_LIST_START: return actionStart(state, action);
      // case actionTypes.EDIT_NOTE_LIST_SUCCESS: return editNotesList(state, action);
      // case actionTypes.DELETE_NOTE_START: return actionStart(state, action);
      // case actionTypes.DELETE_NOTE_SUCCESS: return deleteNote(state, action);
      default: return state;
    }
  }

  return state;
};

export default reducer;
