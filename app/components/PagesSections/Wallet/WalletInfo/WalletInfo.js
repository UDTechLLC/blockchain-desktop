import React from 'react';
import PropTypes from 'prop-types';

import css from './WalletInfo.css';
import commonCss from '../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const walletInfo = props => (
  <div
    className={[
      styles.flexColumn,
      styles.justifyCenter,
      styles.padding15,
      styles.w100,
      styles.WaletsInfo
    ].join(' ')}
  >
    <div>
      <p>
        My Wallet Address
      </p>
      <p>
        {props.address}
      </p>
    </div>
    {/*
    <p className={styles.flex}>
      <span className={styles.flex1}>
        Public  key
      </span>
      <span className={styles.flex3}>
        {props.cpk}
      </span>
    </p>
    */}
    <div>
      <p>
        Balance
      </p>
      <p>
        { props.balance } GHST
      </p>
    </div>
  </div>
);

walletInfo.propTypes = {
  address: PropTypes.string.isRequired,
  // cpk: PropTypes.string.isRequired,
  balance: PropTypes.number.isRequired
};

export default walletInfo;
