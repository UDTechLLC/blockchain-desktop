import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utils/utils';

const initialState = {
  userData: {
    csk: undefined,
    cpk: undefined,
    address: undefined
  },
  error: undefined,
  loading: false
};

const actionStart = state => (updateObject(state, { loading: true }));

const actionFail = (state, action) => (updateObject(state, {
  error: action.error,
  loading: false
}));

const regSuccess = state => (updateObject(state, { loading: false }));

const authSuccess = (state, action) => (updateObject(state, {
  userData: { ...action.userData },
  loading: false
}));

const logoutSuccess = state => (updateObject(state, {
  userData: {
    csk: undefined,
    cpk: undefined,
    address: undefined
  },
  loading: false
}));

const reducer = (state = initialState, action) => {
  if (action) {
    switch (action.type) {
      //  start actions
      case actionTypes.REGISTRATION_START:
      case actionTypes.AUTH_START:
      case actionTypes.LOGOUT_START:
        return actionStart(state, action);
      //  fail actions
      case actionTypes.REGISTRATION_FAIL:
      case actionTypes.AUTH_FAIL:
      case actionTypes.LOGOUT_FAIL:
        return actionFail(state, action);
      //  success actions
      case actionTypes.REGISTRATION_SUCCESS: return regSuccess(state, action);
      case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
      case actionTypes.LOGOUT_SUCCESS: return logoutSuccess(state, action);
      default: return state;
    }
  }

  return state;
};

export default reducer;
