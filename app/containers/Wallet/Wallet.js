/* eslint-disable prefer-destructuring */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../store/actions';

import InfoPanelWrapper from '../../components/InfoPanelWrapper/InfoPanelWrapper';
import BlockchainOperations from '../../components/PagesSections/Wallet/BlochchainOperations/BlochchainOperations';
import DepositWallet from '../../components/PagesSections/Wallet/DepositWallet/DepositWallet';

import css from './Wallet.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class Wallet extends Component {
  state = {
    depositPlanSelect: {
      elementType: 'select',
      id: 'dp-select',
      value: '',
      elementConfig: {
        type: 'select',
        options: [
          {
            value: 'ghost-gst1',
            displayValue: '2SDS SDS + 30% BONUS'
          },
          {
            value: 'ghost-gst2',
            displayValue: '2SDS SDS + 31% BONUS'
          },
          {
            value: 'ghost-gst3',
            displayValue: '2SDS SDS + 32% BONUS'
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
  handleCreateTransaction = (to, amount) => {
    this.props.createTransaction(
      this.props.userData,
      to,
      amount,
      this.props.bcNode
    );
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
              styles.flex1,
              styles.h100,
              styles.paddingSm
            ].join(' ')}
          >
            <BlockchainOperations
              transactionLoading={this.props.transactionLoading}
              handleSubmitTransaction={(to, amount) => this.handleCreateTransaction(to, amount)}
              address={this.props.userData.address}
              balance={this.props.balance.total}
            />
          </div>
          <div
            className={[
              styles.flex3,
              styles.h100,
              styles.paddingSm
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
    address: PropTypes.string
  }).isRequired,
  balance: PropTypes.shape({
    total: PropTypes.number,
    approved: PropTypes.number,
    pending: PropTypes.number
  }).isRequired,
  bcNode: PropTypes.string.isRequired,
  transactionLoading: PropTypes.bool.isRequired,
  createTransaction: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  userData: state.auth.userData,
  balance: state.blockchain.balance,
  transactionLoading: state.blockchain.loading,
  bcNode: state.digest.digestInfo.bcNodes[0]
});

const mapDispatchToProps = dispatch => ({
  createTransaction: (userData, to, amount, bcNode) => (
    dispatch(actions.createTransaction(userData, to, amount, bcNode))
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
