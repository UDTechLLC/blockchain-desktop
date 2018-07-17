/* eslint-disable prefer-destructuring */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';

import * as actions from '../../store/actions';

import InfoPanelWrapper from '../../components/InfoPanelWrapper/InfoPanelWrapper';
import BlockchainOperations from '../../components/PagesSections/Wallet/BlochchainOperations/BlochchainOperations';
import DepositWallet from '../../components/PagesSections/DepositWallet/DepositWallet';

import css from './Wallet.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class Wallet extends Component {
  state = {
    transactionLoading: false,
    depositPlanSelect: {
      elementType: 'select',
      id: 'dp-select',
      value: '',
      elementConfig: {
        type: 'select',
        options: [
          {
            value: 'ghost-gst1',
            displayValue: 'GHOST GST + 30% BONUS'
          },
          {
            value: 'ghost-gst2',
            displayValue: 'GHOST GST + 31% BONUS'
          },
          {
            value: 'ghost-gst3',
            displayValue: 'GHOST GST + 32% BONUS'
          }
        ]
      }
    },
    calculator: {
      data: {
        elementType: 'text',
        label: {
          top: 'DATA',
          bottom: '1GB - 0.90c'
        },
        id: 'calc-data',
        value: 0,
        elementConfig: {
          type: 'text',
          min: '0',
          pattern: '[0-9]*',
          step: '0.0001'
        }
      },
      price: {
        elementType: 'text',
        label: {
          top: 'PRICE',
          bottom: 'MARKET PRICE - $20'
        },
        id: 'calc-price',
        value: 0,
        elementConfig: {
          type: 'text',
          min: '0',
          pattern: '[0-9]*',
          step: '0.0001'
        }
      },
      credit: {
        elementType: 'text',
        label: {
          top: 'CREDIT',
          bottom: '30% - BONUS'
        },
        id: 'calc-credit',
        value: 0,
        elementConfig: {
          type: 'text',
          min: '0',
          pattern: '[0-9]*',
          step: '0.0001'
        }
      },
    }
  };
  handleSubmitTransaction = (to, amount) => {
    this.setState({ transactionLoading: true });
    const userData = this.props.userData;
    const bcNode = `${this.props.bcNodes[0]}`;
    ipcRenderer.send('transaction:create', {
      userData,
      to,
      amount,
      bcNode
    });
    ipcRenderer.once('transaction:done', () => {
      this.props.getBalance(this.props.userData.address, bcNode);
      this.setState({ transactionLoading: false });
    });
  };
  handleDepositPlanChange = value => this.setState({
    depositPlanSelect: {
      ...this.state.depositPlanSelect,
      value
    }
  });
  handleCalculatorFieldChange = (value, key) => {
    this.setState({
      calculator: {
        ...this.state.calculator,
        [key]: {
          ...this.state.calculator[key],
          value
        }
      }
    });
  };
  render() {
    return (
      <InfoPanelWrapper
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
              handleSubmitTransaction={(to, amount) => this.handleSubmitTransaction(to, amount)}
              address={this.props.userData.address}
              // cpk={this.props.userData.cpk}
              balance={this.props.balance.total}
            />
          </div>
          <div
            className={[
              styles.h100,
              styles.flex3
            ].join(' ')}
          >
            <DepositWallet
              depositPlanSelect={this.state.depositPlanSelect}
              handleDepositPlanChange={val => this.handleDepositPlanChange(val)}
              calculator={this.state.calculator}
              handleCalculatorFieldChange={(val, key) => this.handleCalculatorFieldChange(val, key)}
            />
          </div>
        </div>
      </InfoPanelWrapper>
    );
  }
}

Wallet.propTypes = {
  userData: PropTypes.shape({
    csk: PropTypes.string,
    cpk: PropTypes.string,
    address: PropTypes.string
  }),
  balance: PropTypes.shape({
    total: PropTypes.number,
    approved: PropTypes.number,
    pending: PropTypes.number
  }),
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
  balance: {}
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
