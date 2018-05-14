import React from 'react';
import PropTypes from 'prop-types';

import WithCustomScrollbar from '../../../UI/WithCustomScrollbar/WithCustomScrollbar';

import css from './WalletInfo.css';
import commonCss from '../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const walletInfo = props => (
  <WithCustomScrollbar>
    <div
      className={[
        styles.flex3,
        styles.flexColumn,
        styles.justifyCenter,
        styles.wh100,
        styles.lightBlueBg,
        styles.WaletsInfo
      ].join(' ')}
    >
      <p className={styles.flex}>
        <span className={styles.flex1}>
          My Wallet Address
        </span>
        <span className={styles.flex3}>
          {props.address}
        </span>
      </p>
      <p className={styles.flex}>
        <span className={styles.flex1}>
          Public  key
        </span>
        <span className={styles.flex3}>
          {props.cpk}
        </span>
      </p>
      <p className={styles.flex}>
        <span className={styles.flex1}>
          Balance
        </span>
        <span className={styles.flex3}>
          { props.balance } GHT
        </span>
      </p>
    </div>
  </WithCustomScrollbar>
);

walletInfo.propTypes = {
  address: PropTypes.string.isRequired,
  cpk: PropTypes.string.isRequired,
  balance: PropTypes.number.isRequired
};

export default walletInfo;
