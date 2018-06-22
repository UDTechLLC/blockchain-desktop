// import * as actionTypes from '../actions/actionTypes';
// import { updateObject } from '../../utils/utility';

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
  error: null,
  loading: false
};

const reducer = (state = initialState /* , action */) => {
  // if (action) {
  //   switch (action.type) {
  //     case actionTypes.REGISTRATION_START: return regStart(state, action);
  //     case actionTypes.REGISTRATION_SUCCESS: return regSuccess(state, action);
  //     case actionTypes.REGISTRATION_FAIL: return regFail(state, action);
  //     case actionTypes.AUTH_START: return authStart(state, action);
  //     case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
  //     case actionTypes.AUTH_FAIL: return authFail(state, action);
  //     case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
  //     default: return state;
  //   }
  // }

  return state;
};

export default reducer;
