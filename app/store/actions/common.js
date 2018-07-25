import { ipcRenderer } from 'electron';

import * as actionTypes from '../actions/actionTypes';

const ckeckInternetStart = () => {
  ipcRenderer.send('internet-connection:check');
  return { type: actionTypes.NET_CHECK_START };
};

const checkInternetSuccess = () => ({ type: actionTypes.NET_CHECK_SUCCESS });

const checkInternetFail = () => ({ type: actionTypes.NET_CHECK_FAIL });

// eslint-disable-next-line import/prefer-default-export
export const checkInternet = () => dispatch => {
  dispatch(ckeckInternetStart());
  ipcRenderer.once('internet-connection:status', (event, online) => (
    online
      ? dispatch(checkInternetSuccess())
      : dispatch(checkInternetFail())
  ));
};
