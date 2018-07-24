import React from 'react';
import PropTypes from 'prop-types';

import Input from './../../../../UI/Input/Input';
import Button from './../../../../UI/Button/Button';
import { ADMIN_ETH_WALLET } from './../../../../../utils/const';

import css from './Deposit.css';
import commonCss from './../../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const deposit = props => (
  <div className={[styles.w100, styles.flexColumn, styles.justifyCenter].join(' ')}>
    <div>
      <h3 className={[styles.marginXsBottom, styles.orangeHeader].join(' ')}>
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
    <div
      className={[
        styles.w100,
        styles.flex,
        styles.Middle
      ].join(' ')}
    >
      <Input
        elementType="input"
        elementConfig={{
          type: 'text',
          readOnly: true
        }}
        value={ADMIN_ETH_WALLET}

      />
      <Button btnStyles={['marginXsRight']} type="button">Copy</Button>
      <Button type="button">Qr-code</Button>
    </div>
    <div className={[styles.marginSmBottom, styles.Bottom].join(' ')}>
      <h3 className={[styles.marginXsBottom, styles.orangeHeader].join(' ')}>
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