import React from 'react';
import PropTypes from 'prop-types';

import Input from '../../../../UI/Input/Input';

import css from './RateCalc.css';
import commonCss from './../../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const rateCalc = props => {
  const handler = (val, k) => props.handleCalculatorFieldChange(val, k);
  return (
    <div className={[styles.flexColumn, styles.justifyCenter].join(' ')}>
      <h3 className={[styles.orangeHeader, styles.marginXsBottom].join(' ')}>
        CALCULATOR
      </h3>
      <div className={styles.FormWrapper}>
        <form className={[styles.w100, styles.flex].join(' ')}>
          {
            Object.keys(props.calculator).map((k, i) => (
              <Input
                key={i}
                type={props.calculator[k].type}
                elementType={props.calculator[k].elementType}
                value={props.calculator[k].value}
                changed={val => handler(val, k)}
                elementConfig={props.calculator[k].elementConfig}
                id={props.calculator[k].id}
                label={props.calculator[k].label}
              />
            ))
          }
        </form>
      </div>
    </div>
  );
};

rateCalc.propTypes = {
  calculator: PropTypes.shape().isRequired,
  handleCalculatorFieldChange: PropTypes.func.isRequired
};

export default rateCalc;
