import { ipcRenderer } from 'electron';

import * as actionTypes from './actionTypes';

const getBalanceStart = (address, bcNode) => dispatch => {
  ipcRenderer.send('blockchain:wallet-check', { address, bcNode });
  ipcRenderer.once('blockchain:wallet-checked', (event, data) => {
    dispatch(getBalanceSuccess(data));
    ipcRenderer.removeAllListeners('blockchain:wallet-check');
  });
  return {
    type: actionTypes.GET_BALANCE_START
  };
};

const getBalanceSuccess = data => ({
  type: actionTypes.GET_BALANCE_SUCCESS,
  balance: data.balance,
  success: data.success
});

// const getBalanceFail = () => ();

export const getBalance = (address, bcNode) => dispatch => (
  dispatch(getBalanceStart(address, bcNode))
);
