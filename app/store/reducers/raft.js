import _ from 'lodash';
import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utils/utility';
import { ROOT_HASH } from '../../utils/const';
// import { objOrderBy } from '../../utils/commonFunctions';

const rootFolderObject = {
  parentFolder: null,
  name: 'root',
  timestamp: 0,
  securityLayers: {
    _2fa: false,
    pin: false,
    key: false,
    voice: false
  }
};
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
    [ROOT_HASH]: rootFolderObject
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

const actionStart = state => (updateObject(state, {
  loading: true
}));

const actionFailed = state => (updateObject(state, {
  loading: false
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
    ...action.data.folders,
    ...state.folders
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
    ...action.newFolder,
    ...state.folders
  },
  loading: false
}));

const editFolderSuccess = (state, action) => updateObject(state, {
  folders: {
    ...state.folders,
    [action.signature]: {
      ...state.folders[action.signature],
      name: action.newName
    }
  },
  loading: false
});

const deleteFolderSuccess = (state, action) => (updateObject(state, {
  folders: _.pickBy(state.folders, (v, k) => k !== action.folderId),
  files: _.pickBy(state.files, v => v.parentFolder !== action.folderId),
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

const createNoteSuccess = (state, action) => (updateObject(state, {
  notes: {
    ...action.newNote,
    ...state.notes
  },
  loading: false
}));

const updateNoteSuccess = (state, action) => (updateObject(state, {
  notes: {
    ...state.notes,
    [action.signature]: {
      ...state.notes[action.signature],
      ...action.noteUpdateData
    }
  },
  loading: false
}));

const removeNoteSuccess = (state, action) => (updateObject(state, {
  notes: _.pickBy(state.notes, (v, k) => k !== action.signature),
  loading: false
}));

const setTimebombSuccess = (state, action) => {
  let result;
  switch (action.objType) {
    case 'note':
      result = (
        updateObject(state, {
          notes: {
            ...state.notes,
            [action.signature]: {
              ...state.notes[action.signature],
              timebomb: action.timestamp
            }
          },
          loading: false
        })
      );
      break;
    default:
      result = (
        updateObject(state, {
          files: {
            ...state.files,
            [action.signature]: {
              ...state.files[action.signature],
              timebomb: action.timestamp
            }
          },
          loading: false
        })
      );
      break;
  }
  return result;
};

const reducer = (state = initialState, action) => {
  if (action) {
    switch (action.type) {
      //  get settings
      case actionTypes.GET_APP_SETTINGS_START: return actionStart(state, action);
      case actionTypes.GET_APP_SETTINGS_SUCCESS: return getAppSettingsSuccess(state, action);
      case actionTypes.GET_APP_SETTINGS_FAIL: return actionFailed(state, action);
      //  get raft data
      case actionTypes.GET_USER_DATA_START: return actionStart(state, action);
      case actionTypes.GET_USER_DATA_SUCCESS: return getUserDataSuccess(state, action);
      case actionTypes.GET_USER_DATA_FAIL: return actionFailed(state, action);
      // folders- create
      case actionTypes.CREATE_NEW_FOLDER_START: return actionStart(state, action);
      case actionTypes.CREATE_NEW_FOLDER_SUCCESS: return createNewFolderSuccess(state, action);
      case actionTypes.CREATE_NEW_FOLDER_FAIL: return actionFailed(state, action);
      //  folders - update
      case actionTypes.EDIT_FOLDER_START: return actionStart(state, action);
      case actionTypes.EDIT_FOLDER_SUCCESS: return editFolderSuccess(state, action);
      case actionTypes.EDIT_FOLDER_FAIL: return actionFailed(state, action);
      //  folders - delete
      case actionTypes.DELETE_FOLDER_START: return actionStart(state, action);
      case actionTypes.DELETE_FOLDER_SUCCESS: return deleteFolderSuccess(state, action);
      case actionTypes.DELETE_FOLDER_FAIL: return actionFailed(state, action);
      //  files - create
      case actionTypes.UPLOAD_FILES_START: return actionStart(state, action);
      case actionTypes.UPLOAD_FILES_SUCCESS: return uploadFilesSuccess(state, action);
      case actionTypes.UPLOAD_FILES_FAIL: return actionFailed(state, action);
      //  files - get
      case actionTypes.DOWNLOAD_FILE_START: return actionStart(state, action);
      case actionTypes.DOWNLOAD_FILE_SUCCESS: return downloadFileSuccess(state, action);
      case actionTypes.DOWNLOAD_FILE_FAIL: return actionFailed(state, action);
      case actionTypes.SAVE_DOWNLOADED_FILE: return saveDownloadedFile(state, action);
      //  files- remove
      case actionTypes.REMOVE_FILE_START: return actionStart(state, action);
      case actionTypes.REMOVE_FILE_SUCCESS: return removeFileSuccess(state, action);
      case actionTypes.REMOVE_FILE_FAIL: return actionFailed(state, action);
      //  notes - create
      case actionTypes.CREATE_NOTE_START: return actionStart(state, action);
      case actionTypes.CREATE_NOTE_SUCCESS: return createNoteSuccess(state, action);
      case actionTypes.CREATE_NOTE_FAIL: return actionFailed(state, action);
      //  notes - update
      case actionTypes.EDIT_NOTE_START: return actionStart(state, action);
      case actionTypes.EDIT_NOTE_SUCCESS: return updateNoteSuccess(state, action);
      case actionTypes.EDIT_NOTE_FAIL: return actionFailed(state, action);
      //  notes - delete
      case actionTypes.REMOVE_NOTE_START: return actionStart(state, action);
      case actionTypes.REMOVE_NOTE_SUCCESS: return removeNoteSuccess(state, action);
      case actionTypes.REMOVE_NOTE_FAIL: return actionFailed(state, action);
      //  timebomb - set
      case actionTypes.SET_TIMEBOMB_START: return actionStart(state, action);
      case actionTypes.SET_TIMEBOMB_SUCCESS: return setTimebombSuccess(state, action);
      case actionTypes.SET_TIMEBOMB_FAIL: return actionFailed(state, action);
      default: return state;
    }
  }

  return state;
};

export default reducer;
