import React from 'react';
import PropTypes from 'prop-types';

import css from './Button.css';
import commonCss from '../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const button = (props) => {
  const btnStyles = [
    styles.h100,
    styles.lightBlueBg,
    styles.blue,
    styles.Button
  ];
  return (
    <div
      className={[
        styles.flexColumnAllCenter,
        styles.wh100,
      ].join(' ')}
    >
      <button
        disabled={props.disabled}
        className={
          !props.btnStyles || !props.btnStyles.length
            ? [...btnStyles].join(' ')
            : [...btnStyles, ...props.btnStyles.map(style => styles[style])].join(' ')
        }
        onClick={props.onClick}
      >
        <div>
          {props.children}
        </div>
      </button>
    </div>
  );
};

button.propTypes = {
  children: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  btnStyles: PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func
};

button.defaultProps = {
  disabled: false,
  btnStyles: [],
  onClick: null
};

export default button;
