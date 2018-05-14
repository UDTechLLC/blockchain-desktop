import React from 'react';
import PropTypes from 'prop-types';

import css from './Button.css';
import commonCss from '../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const button = (props) => (
  <div
    className={[
      styles.flexColumnAllCenter,
      styles.h100,
    ].join(' ')}
  >
    <button
      disabled={props.disabled}
      className={
        props.btnType.length === 0
          ? [
            styles.h100,
            styles.lightBlueBg,
            styles.blue,
            styles.Button
          ].join(' ')
          : [
            styles.h100,
            styles.lightBlueBg,
            styles.blue,
            styles.Button,
            ...styles[props.btnType]
          ].join(' ')
      }
      onClick={props.onClick}
    >
      <div>
        {props.children}
      </div>
    </button>
  </div>
);

button.propTypes = {
  children: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  btnType: PropTypes.string,
  onClick: PropTypes.func
};

button.defaultProps = {
  disabled: false,
  btnType: '',
  onClick: null
};

export default button;
