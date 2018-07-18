import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

import css from './Button.css';
import commonCss from '../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class Button extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.timer === this.props.maxTimerVal;
  }
  render() {
    return (
      <button
        key={uuidv4()}
        className={[
          styles.transparentButton,
          styles.absolute100,
          styles.Button
        ].join(' ')}
        onClick={() => this.props.buttonClick(this.props.value)}
      >
        <div
          className={styles.ButtonInnerContainer}
        >
          <div className={[styles.marginXsBottom, styles.SupTitle].join(' ')}>
            {this.props.suptitle}&nbsp;
          </div>
          <div className={[styles.marginXsBottom, styles.Title].join(' ')}>
            {this.props.title}
          </div>
          {
            this.props.letters
              ? (
                <div className={[styles.flex, styles.SubTitle].join(' ')}>
                  {this.props.letters.map((l, j) => <div key={j}>{l}</div>)}
                </div>
              )
              : undefined
          }
          <div />
        </div>
        <div className={[styles.absolute100, styles.FocusBlock].join(' ')}>
          <div /><div /><div /><div />
        </div>
      </button>
    );
  }
}

Button.propTypes = {
  suptitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  letters: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  buttonClick: PropTypes.func.isRequired,
  timer: PropTypes.number,
  maxTimerVal: PropTypes.number,
};

Button.defaultProps = {
  suptitle: undefined,
  title: undefined,
  letters: [],
  value: undefined,
  timer: 1,
  maxTimerVal: 39,
};

export default Button;
