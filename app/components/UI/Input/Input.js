/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/label-has-for */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Aux from '../../../hoc/Aux/Aux';
import Backdrop from '../../UI/Backdrop/Backdrop';

import css from './Input.css';
import commonCss from '../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class Input extends Component {
  state = { show: false };
  render() {
    let inputElement = null;
    const inputClasses = [
      styles.paddingSm,
      styles.marginXsBottom,
      styles.w100,
      styles.cyan,
      styles.lightBlueBg,
      styles.InputElement
    ];
    if (this.props.invalid && this.props.shouldValidate && this.props.touched) {
      inputClasses.push(styles.Invalid);
    }
    switch (this.props.elementType) {
      case 'textarea':
        inputElement = (
          <div>
            <textarea
              className={inputClasses.join(' ')}
              {...this.props.elementConfig}
              value={this.props.value}
              onChange={this.props.changed}
              id={this.props.id}
            />
          </div>
        );
        break;
      case 'select':
        inputElement = (
          <div>
            <div
              role="button"
              tabIndex={0}
              className={[
                styles.flex,
                styles.alignCenter,
                styles.relative,
                styles.margin0,
                styles.marginXsBottom,
                styles.Select,
                ...inputClasses
              ].join(' ')}
              id={this.props.id}
              onClick={() => this.setState({ show: !this.state.show })}
            >
              <div
                className={[
                  styles.flexColumn,
                  styles.justifyCenter,
                  styles.blueGreenBg,
                  styles.paddingSm
                ].join(' ')}
              >
                {this.props.value.displayValue || 'Choose one'}
              </div>
              <div
                className={[
                  styles.flexColumn,
                  styles.Options,
                  this.state.show ? undefined : styles.Hide
                ].join(' ')}
              >
                {
                  this.props.elementConfig.options.map((option, i) => (
                    <button
                      tabIndex={0}
                      key={i}
                      className={[
                        styles.cyan,
                        styles.blueGreenBg,
                        styles.paddingSm
                      ].join(' ')}
                      onClick={(e) => { e.stopPropagation(); this.props.changed(option); }}
                    >
                      {option.displayValue}
                    </button>
                  ))
                }
              </div>
              <div
                className={[
                  styles.flexAllCenter,
                  styles.blueGreenBg,
                  styles.h100,
                  // styles.absolute100,
                  styles.ArrowDown
                ].join(' ')}
              >
                <i className="fa fa-chevron-down" aria-hidden="true" />
              </div>
            </div>
          </div>
        );
        break;
      default:
        inputElement = (
          <div>
            <div>
              <input
                className={inputClasses.join(' ')}
                value={this.props.value}
                onChange={e => this.props.changed(e.target.value)}
                id={this.props.id}
                {...this.props.elementConfig}
              />
              <div className={[styles.marginXsBottom, styles.ErrorMessage].join(' ')}>
                {this.props.invalid ? this.props.errorMessage : undefined}
              </div>
            </div>
          </div>
        );
        break;
    }
    return (
      <Aux>
        <Backdrop
          transparent
          show={this.state.show}
          onClick={() => this.setState({ show: !this.state.show })}
        />
        <div className={[styles.w100, styles.Input].join(' ')}>
          {
            this.props.label && (typeof this.props.label !== 'object' || (typeof this.props.label === 'object' && this.props.label.top))
              ? (
                <label
                  className={[
                    styles.blue,
                    styles.marginXsBottom,
                    styles.Label
                  ].join(' ')}
                  htmlFor={this.props.id}
                >
                  {typeof this.props.label !== 'object' ? this.props.label : this.props.label.top}
                </label>
              )
              : undefined
          }
          {inputElement}
          {
            this.props.label && typeof this.props.label === 'object' && this.props.label.bottom
              ? (
                <div
                  className={[
                    styles.blue,
                    styles.marginXsBottom,
                    styles.Label,
                    styles.BottomLabel
                  ].join(' ')}
                >
                  {this.props.label.bottom}
                </div>
              )
              : undefined
          }
        </div>
      </Aux>
    );
  }
}

Input.propTypes = {
  invalid: PropTypes.bool,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.shape()
  ]),
  errorMessage: PropTypes.string,
  elementConfig: PropTypes.shape({
    type: PropTypes.string,
    placeholder: PropTypes.string,
    options: PropTypes.array
  }),
  shouldValidate: PropTypes.bool,
  touched: PropTypes.bool,
  elementType: PropTypes.string.isRequired,
  changed: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.shape()
  ]),
  id: PropTypes.string,
};

Input.defaultProps = {
  invalid: false,
  label: undefined,
  errorMessage: '',
  shouldValidate: false,
  touched: false,
  changed: () => undefined,
  value: undefined,
  id: undefined,
  elementConfig: { type: 'text' }
};

export default Input;
