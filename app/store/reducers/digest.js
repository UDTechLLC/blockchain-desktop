import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utils/utils';

const initialState = {
  digestInfo: {},
  error: undefined,
  loading: false
};

const actionStart = state => (updateObject(state, { loading: true }));

const actionFail = (state, action) => (updateObject(state, {
  error: action.error,
  loading: false
}));

const authSuccess = (state, action) => (updateObject(state, {
  digestInfo: { ...action.digestInfo },
  loading: false
}));

const authLogout = state => (updateObject(state, {
  digestInfo: {},
  loading: false
}));

const reducer = (state = initialState, action) => {
  if (action) {
    switch (action.type) {
      case actionTypes.AUTH_START:
        return actionStart(state, action);
      case actionTypes.AUTH_SUCCESS:
        return authSuccess(state, action);
      case actionTypes.AUTH_FAIL: return actionFail(state, action);
      case actionTypes.LOGOUT_SUCCESS: return authLogout(state, action);
      default: return state;
    }
  }

  return state;
};

export default reducer;
