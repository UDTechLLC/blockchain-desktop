import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utils/utils';

const initialState = {
  balance: {
    total: 0,
    approved: 0,
    pending: 0
  },
  error: undefined,
  loading: false
};

const actionStart = state => (updateObject(state, { loading: true }));

const actionFail = (state, action) => (updateObject(state, {
  error: action.error,
  loading: false
}));

const updBalance = (state, action) => (updateObject(state, {
  balance: { ...state.balance, ...action.wallet.balance },
  loading: false
}));

const reducer = (state = initialState, action) => {
  if (action) {
    switch (action.type) {
      //  start actions
      case actionTypes.AUTH_START:
      case actionTypes.CREATE_TRANSACTION_START:
        return actionStart(state, action);
      //  fail actions
      case actionTypes.AUTH_FAIL:
      case actionTypes.CREATE_TRANSACTION_FAIL:
        return actionFail(state, action);
      //  success actions
      case actionTypes.AUTH_SUCCESS:
      case actionTypes.CREATE_TRANSACTION_SUCCESS:
        return updBalance(state, action);
      default: return state;
    }
  }

  return state;
};

export default reducer;
