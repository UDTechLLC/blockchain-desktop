import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ipcRenderer } from 'electron';

import PinCode from './../../components/PinCode/PinCode';
import Access from './../../components/PagesSections/Homepage/Access/Access';
import Register from './../../components/PagesSections/Homepage/Register/Register';

import * as actions from '../../store/actions';
import css from './Homepage.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class Homepage extends Component {
  state = {
    password: undefined,
    repeatPassword: undefined,
    credentialsPath: undefined,
    pinCodeTarget: 'password'
  };
  handlePinCodeBtnClick = val => {
    const target = this.state.pinCodeTarget;
    //  check max size
    if (`${this.state[target]}${val}`.length > 12) {
      return ipcRenderer.send('message-box:show', {
        type: 'info',
        buttons: ['Ok'],
        message: 'Max length of password - is 12 symbols'
      });
    }
    this.setState({ [target]: this.state[target] || (this.state[target] === 0 || val === 0)
      ? `${this.state[target]}${val}`
      : val.toString()
    });
  };
  handlePinCodeSubmit = () => {
    const url = this.props.location.pathname;
    const target = this.state.pinCodeTarget;
    //  check min size
    if (!this.state[target] || this.state[target] < 4) {
      return ipcRenderer.send('message-box:show', {
        type: 'info',
        buttons: ['Ok'],
        message: 'Min length of password - is 4 symbols'
      });
    }
    //  rules for access && register
    if (url === '/access') {
      if (!this.state.credentialsPath) {
        return ipcRenderer.send('message-box:show', {
          type: 'info',
          buttons: ['Ok'],
          message: 'Upload your credential files for access'
        });
      }
      //  auth action
      this.props.handleAuth(this.state.password, this.state.credFilePath);
    } else if (url === '/register') {
      if (!this.state.repeatPassword) {
        return this.setState({ pinCodeTarget: 'repeatPassword' });
      } else if (this.state.password !== this.state.repeatPassword) {
        ipcRenderer.send('message-box:show', {
          type: 'info',
          buttons: ['Ok'],
          message: 'Password doesn\'t match!'
        });
        return this.handleClearPassword;
      }
      // reg action
      this.props.handleRegister(this.state.password);
    }
  };
  handleClearPassword = () => {
    this.setState({ password: undefined, repeatPassword: undefined, pinCodeTarget: 'password' });
  };
  render() {
    return (
      <div
        className={[
          styles.wh100,
          styles.flex
        ].join(' ')}
      >
        <div
          className={[
            styles.flex2,
            styles.paddingMd,
            styles.relative,
            styles.flexColumn,
            styles.justifyCenter,
            styles.w100
          ].join(' ')}
        >
          <PinCode
            password={this.state.password}
            buttonClick={val => this.handlePinCodeBtnClick(val)}
            handleSubmit={this.handlePinCodeSubmit}
            handleClearPassword={this.handleClearPassword}
          />
        </div>
        <div className={[styles.flex3, styles.paddingMd, styles.relative].join(' ')}>
          <Switch>
            <Route
              exact
              key={Math.random()}
              path="/access"
              component={() => (
                <Access
                  password={this.state.password}
                  handleDropFile={({ path }) => this.setState({ credentialsPath: path })}
                />
              )}
            />
            <Route
              exact
              key={Math.random()}
              path="/register"
              component={() => (
                <Register
                  password={this.state.password}
                  repeatPassword={this.state.repeatPassword}
                />
              )}
            />
            <Redirect to="/access" />
          </Switch>
        </div>
      </div>
    );
  }
}

Homepage.propTypes = {
  location: PropTypes.shape(),
  handleAuth: PropTypes.func.isRequired,
  handleRegister: PropTypes.func.isRequired
};

Homepage.defaultProps = {
  location: { pathname: '/access' }
};

const mapDispatchToProps = dispatch => ({
  handleAuth: (password, filePath) => dispatch(actions.auth(password, filePath)),
  handleRegister: password => dispatch(actions.registration(password))
});

export default connect(/* mapStateToProps */null, mapDispatchToProps)(Homepage);

