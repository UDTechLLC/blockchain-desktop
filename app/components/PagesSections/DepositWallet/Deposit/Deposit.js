import React from 'react';
import PropTypes from 'prop-types';

import Input from '../../../UI/Input/Input';
import { ADMIN_ETH_WALLET } from '../../../../utils/const';

import css from './Deposit.css';
import commonCss from '../../../../assets/css/common.css';

// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const deposit = props => (
  <div className={styles.Deposit}>
    <div className={styles.Top}>
      <h3 className={styles.orangeHeader}>
        Deposit
      </h3>
      <Input
        type={props.depositPlanSelect.type}
        elementType={props.depositPlanSelect.elementType}
        value={props.depositPlanSelect.value}
        changed={val => props.handleDepositPlanChange(val)}
        elementConfig={props.depositPlanSelect.elementConfig}
      />
    </div>
    <div className={styles.Middle}>
      <input type="text" value={ADMIN_ETH_WALLET} readOnly />
      <button type="button">Copy</button>
      <button type="button">Qr-code</button>
    </div>
    <div className={styles.Bottom}>
      <h3 className={styles.orangeHeader}>
        Important
      </h3>
      <p>
        Send only ETH to this deposit address.Sending any other
        currency to this address may result in the loss of
        your deposit.
      </p>
    </div>
  </div>
);

deposit.propTypes = {
  depositPlanSelect: PropTypes.shape().isRequired,
  handleDepositPlanChange: PropTypes.func.isRequired
};

export default deposit;
