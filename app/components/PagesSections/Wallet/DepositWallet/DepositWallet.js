import React from 'react';
import PropTypes from 'prop-types';

import Deposit from './Deposit/Deposit';
import RateCalc from './RateCalc/RateCalc';
import WithCustomScrollbar from '../../../UI/WithCustomScrollbar/WithCustomScrollbar';

import css from './DepositWallet.css';
import commonCss from '../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const depositWallet = props => (
  <WithCustomScrollbar>
    <div className={[styles.wh100, styles.flexColumn, styles.DepositWallet].join(' ')}>
      <Deposit
        depositPlanSelect={props.depositPlanSelect}
        handleDepositPlanChange={val => props.handleDepositPlanChange(val)}
      />
      <RateCalc
        calculator={props.calculator}
        handleCalculatorFieldChange={(val, key) => props.handleCalculatorFieldChange(val, key)}
      />
    </div>
  </WithCustomScrollbar>
);

depositWallet.propTypes = {
  depositPlanSelect: PropTypes.shape().isRequired,
  handleDepositPlanChange: PropTypes.func.isRequired,
  calculator: PropTypes.shape().isRequired,
  handleCalculatorFieldChange: PropTypes.func.isRequired
};

export default depositWallet;
