/* eslint-disable prefer-destructuring */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';

import * as actions from '../../store/actions';

// import CreateTransaction from '../../components/PagesSections/Wallet/CreateTransaction/CreateTransaction';
// import WalletInfo from '../../components/PagesSections/Wallet/WalletInfo/WalletInfo';
import PageWithInfoPanel from '../PageWithInfoPanel/PageWithInfoPanel';
import BlockchainOperations from '../../components/PagesSections/Wallet/BlochchainOperations/BlochchainOperations';

import css from './Wallet.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class Wallet extends Component {
  state = {
    minenow: true,
    transactionLoading: false
  };
  handleOnMineNowCheck = () => this.setState({ minenow: !this.state.minenow });
  handleSubmitTransaction = (to, amount) => {
    this.setState({ transactionLoading: true });
    const userData = this.props.userData;
    const minenow = this.state.minenow;
    const bcNode = `${this.props.bcNodes[0]}`;
    ipcRenderer.send('transaction:create', {
      userData,
      to,
      amount,
      minenow,
      bcNode
    });
    ipcRenderer.once('transaction:done', () => {
      this.props.getBalance(this.props.userData.address, bcNode);
      this.setState({ transactionLoading: false });
    });
  };
  render() {
    {/*
      <div className={[styles.wh100, styles.WalletWrapper].join(' ')}>
        <div className={[styles.wh100, styles.flexBetweenCenter].join(' ')}>
          <div
            className={[
              styles.flex2,
              styles.WalletOperations
            ].join(' ')}
          >
            <CreateTransaction
              transactionLoading={this.state.transactionLoading}
              minenow={this.state.minenow}
              handleOnMineNowCheck={() => this.handleOnMineNowCheck()}
              handleSubmitTransaction={(to, amount) => this.handleSubmitTransaction(to, amount)}
            />
          </div>
          <div
            className={[
              styles.flex3,
              styles.flexColumnAllCenter,
              styles.wh100,
              styles.WalletInfoWrapper
            ].join(' ')}
          >
            <WalletInfo
              address={this.props.userData.address}
              cpk={this.props.userData.cpk}
              balance={this.props.balance}
            />
          </div>
        </div>
      </div>
      */}
    return (
      <PageWithInfoPanel
        columns={[
          'SecurityLayer',
          'SecurityLayer'
        ]}
      >
        <div
          className={[
            styles.wh100,
            styles.flex
          ].join(' ')}
        >
          <div
            className={[
              styles.h100,
              styles.flex1
            ].join(' ')}
          >
            <BlockchainOperations
              transactionLoading={this.state.transactionLoading}
              minenow={this.state.minenow}
              handleOnMineNowCheck={() => this.handleOnMineNowCheck()}
              handleSubmitTransaction={(to, amount) => this.handleSubmitTransaction(to, amount)}
              address={this.props.userData.address}
              // cpk={this.props.userData.cpk}
              balance={this.props.balance}
            />
          </div>
          <div
            className={[
              styles.h100,
              styles.flex3
            ].join(' ')}
          >
            deposit
          </div>
        </div>
      </PageWithInfoPanel>
    );
  }
}

Wallet.propTypes = {
  userData: PropTypes.shape({
    csk: PropTypes.string,
    cpk: PropTypes.string,
    address: PropTypes.string
  }),
  balance: PropTypes.number,
  getBalance: PropTypes.func.isRequired,
  bcNodes: PropTypes.arrayOf(PropTypes.string)
};

Wallet.defaultProps = {
  userData: {
    csk: null,
    cpk: null,
    address: null
  },
  bcNodes: [],
  balance: 0
};

const mapStateToProps = state => ({
  userData: state.auth.userData,
  balance: state.blockchain.balance,
  bcNodes: state.digest.digestInfo.bcNodes
});

const mapDispatchToProps = dispatch => ({
  getBalance: (address, bcNode) => dispatch(actions.getBalance(address, bcNode))
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
