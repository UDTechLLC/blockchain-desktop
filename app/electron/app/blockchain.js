/* eslint-disable object-curly-newline */
const axios = require('axios');
const { ipcMain, dialog } = require('electron');

const utils = require('../utils/utils');
const wallet = require('../utils/wallet');

const bc = mainWindow => {
  //  on blockchain wallet check listener
  ipcMain.on('blockchain:wallet-check', (event, { address, bcNode }) => (
    axios.get(`${bcNode}/wallet/${address}`)
      .then(({ data }) => (
        mainWindow.webContents.send('blockchain:wallet-checked', data)
      ))
      .catch(({ response }) => utils.catchRestError(mainWindow, response, 'blockchain:wallet-check', 'GET'))
  ));
  //  on create prepare and create transaction listener
  ipcMain.on('transaction:create', (event, { userData, to, amount, bcNode }) => {
    //  if user enter not valid wallet address - throw new Error
    if (!wallet.validateAddress(to)) {
      mainWindow.webContents.send('transaction:done');
      const errorMessage = 'Entered address is not valid';
      console.log(errorMessage);
      return dialog.showErrorBox('Error', errorMessage);
    }
    //  else prepare transaction
    const prepData = {
      from: userData.address,
      to,
      amount: parseInt(amount, 10),
      pubkey: userData.cpk
    };
    return axios.post(`${bcNode}/tx/prepare`, prepData)
      .then(({ data }) => {
        const signatures = data.hashes.map(transactionHash => (
          wallet.ecdsaSign(transactionHash, userData.csk)
        ));
        return {
          txserialized: data.txserialized,
          from: userData.address,
          signatures
        };
      })
      .then(sendData => (
        axios.post(`${bcNode}/tx/sign`, sendData)
          .then(() => mainWindow.webContents.send('transaction:done'))
          .catch(({ response }) => utils.catchRestError(mainWindow, response, 'transaction:create'))
      ))
      .catch(({ response }) => utils.catchRestError(mainWindow, response, 'transaction:create'));
  });
};

export default bc;
