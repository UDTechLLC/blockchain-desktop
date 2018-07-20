import { ipcRenderer } from 'electron';

import * as actionTypes from './actionTypes';

const createTransactionStart = () => ({ type: actionTypes.CREATE_TRANSACTION_START });

const createTransactionSuccess = wallet => ({
  type: actionTypes.CREATE_TRANSACTION_SUCCESS,
  wallet
});

const createTransactionFail = error => ({
  type: actionTypes.CREATE_TRANSACTION_FAIL,
  error
});

export const createTransaction = (userData, to, amount, bcNode) => dispatch => {
  dispatch(createTransactionStart());
  ipcRenderer.send('create-transaction:start', { userData, to, amount, bcNode });
  ipcRenderer.once('create-transaction:success', (event, wallet) => {
    dispatch(createTransactionSuccess(wallet));
  });
  ipcRenderer.once('create-transaction:fail', (event, error) => {
    dispatch(createTransactionFail(error));
  });
};
