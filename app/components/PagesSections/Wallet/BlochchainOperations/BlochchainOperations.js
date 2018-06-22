import React from 'react';
import PropTypes from 'prop-types';

import WithCustomScrollbar from '../../../UI/WithCustomScrollbar/WithCustomScrollbar';
import CreateTransaction from '../CreateTransaction/CreateTransaction';
import WalletInfo from '../WalletInfo/WalletInfo';

import css from './BlochchainOperations.css';
import commonCss from '../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const blockchainOperations = props => (
  <WithCustomScrollbar>
    <div
      className={[
        styles.wh100,
        styles.flexColumn,
        styles.justifyAround,
        styles.padding15,
        styles.BlochchainOperations
      ].join(' ')}
    >
      <div
        className={styles.w100}
      >
        <CreateTransaction
          transactionLoading={props.transactionLoading}
          handleSubmitTransaction={(to, amount) => props.handleSubmitTransaction(to, amount)}
        />
      </div>
      <div
        className={[
          // styles.flexColumn,
          // styles.wh100
          styles.w100
        ].join(' ')}
      >
        <WalletInfo
          address={props.address}
          balance={props.balance}
        />
      </div>
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
