import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';

import PinCode from './../../components/PinCode/PinCode';
import Access from './Access/Access';
import Register from './Register/Register';

import css from './Homepage.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class Homepage extends Component {
  state = {
    password: undefined,
    repeatPassword: undefined,
    credentialsPath: undefined
  };
  render() {
    console.log(this.props.match);
    return (
      <div
        className={[
          styles.wh100,
          styles.flex
        ].join(' ')}
      >
        <div>
          <PinCode
            password={this.state.password}
            buttonClick={val => this.buttonClick(val)}
            handleSubmit={this.handleSubmit}
            handleClearPassword={this.handleClearPassword}
          />
        </div>
        <div>
          <Switch>
            <Route path="/access" exact component={Access} key={Math.random()} />
            <Route path="/register" exact component={Register} key={Math.random()} />
            <Redirect to="/access" />
          </Switch>
        </div>
      </div>
    );
  }
}

Homepage.propTypes = {
  match: PropTypes.shape().isRequired
};

export default Homepage;

