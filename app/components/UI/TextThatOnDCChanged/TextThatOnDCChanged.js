/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Aux from '../../../hoc/Aux/Aux';
import Backdrop from '../../UI/Backdrop/Backdrop';

import css from './TextThatOnDCChanged.css';
import commonCss from '../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class TextThatOnDCChanged extends Component {
  state = {
    edittable: false
  };
  handleDC = () => this.setState({ edittable: true }, () => this.inputFolderName.focus());
  handleSubmit = () => {
    this.props.onFolderNameEdit();
    this.setState({ edittable: false });
  };
  render() {
    return (
      <div
        role="button"
        tabIndex={-1}
        className={[
          styles.wh100,
          styles.ComponentWrapper
        ].join(' ')}
        onClick={() => this.props.onClick(this.props.value)}
        onDoubleClick={() => this.handleDC()}
      >
        {
          !this.state.edittable
            ? (
              <div
                className={[
                  styles.wh100,
                  styles.flexAllCenter
                ].join(' ')}
              >
                {this.props.value}
              </div>
            )
            : (
              <form
                className={[
                  styles.wh100
                ].join(' ')}
                onSubmit={e => { e.preventDefault(); this.handleSubmit(); }}
              >
                <Aux>
                  <Backdrop
                    show={this.state.edittable}
                    onClick={e => { this.setState({ edittable: false }); this.handleSubmit(e); }}
                    transparent
                  />
                  <input
                    type="text"
                    onChange={e => this.props.onValueChange(e.target.value)}
                    value={this.props.value}
                    ref={input => { this.inputFolderName = input; }}
                    className={[
                      styles.wh100,
                      styles.orange,
                      styles.TheInput
                    ].join(' ')}
                  />
                </Aux>
              </form>
            )
        }
      </div>
    );
  }
}

TextThatOnDCChanged.propTypes = {
  onClick: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onValueChange: PropTypes.func.isRequired,
  onFolderNameEdit: PropTypes.func.isRequired
};


TextThatOnDCChanged.defaultProps = {
  value: ''
};

export default TextThatOnDCChanged;
