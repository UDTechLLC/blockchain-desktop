import React from 'react';
import PropTypes from 'prop-types';

import WithCustomScrollbar from '../../../UI/WithCustomScrollbar/WithCustomScrollbar';
import CreateTransaction from './CreateTransaction/CreateTransaction';
import WalletInfo from './WalletInfo/WalletInfo';

import commonCss from '../../../../assets/css/common.css';
// global classe;s names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss };

const blockchainOperations = props => (
  <WithCustomScrollbar>
    <div
      className={[
        styles.wh100,
        styles.flexColumnAllCenter
      ].join(' ')}
    >
      <CreateTransaction
        transactionLoading={props.transactionLoading}
        handleSubmitTransaction={(to, amount) => props.handleSubmitTransaction(to, amount)}
      />
      <WalletInfo
        address={props.address}
        balance={props.balance}
      />
    </div>
  </WithCustomScrollbar>
);

blockchainOperations.propTypes = {
  handleSubmitTransaction: PropTypes.func.isRequired,
  transactionLoading: PropTypes.bool.isRequired,
  address: PropTypes.string.isRequired,
  balance: PropTypes.number.isRequired
};

export default blockchainOperations;
