import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import { checkInternet } from './store/actions/index';
import Spinner from './components/UI/Spinner/Spinner';
import Layout from './hoc/Layout/Layout';
import NoInternetConnection from './components/PagesSections/NoInternetConnection/NoInternetConnection';
import Homepage from './containers/Homepage/Homepage';
import GhostDrive from './containers/GhostDrive/GhostDrive';
import Wallet from './containers/Wallet/Wallet';
import Settings from './containers/Settings/Settings';
import GhostNote from './containers/GhostNote/GhostNote';
import Logout from './containers/Homepage/Logout/Logout';
import Ghost from './components/Animations/Ghost/Ghost';

import { bg } from './assets/img/img';

import classes from './App.css';

class App extends Component {
  state = {
    content: false,
  };
  componentWillMount() {
    this.props.checkInternet();
    setTimeout(() => this.setState({ content: true }), 1649);
  }
  render() {
    let routes;
    if (this.props.internetChecking) {
      routes = <Spinner />;
    } else {
      // eslint-disable-next-line no-lonely-if
      if (this.props.internet) {
        routes = (
          <Switch>
            <Route path="/" component={Homepage} key={Math.random()} />
            <Redirect to="/" />
          </Switch>
        );
        if (this.props.isAuth) {
          routes = (
            <Switch>
              <Route exact path="/ghost-drive" component={GhostDrive} key={Math.random()} />
              {/*
              <Route exact path="/account" component={Settings} key={Math.random()} />
              <Route exact path="/wallet" component={Wallet} key={Math.random()} />
              <Route exact path="/ghost-pad" component={GhostNote} key={Math.random()} />
              <Route exact path="/logout" component={Logout} key={Math.random()} />
              */}
              <Redirect to="/ghost-drive" />
            </Switch>
          );
        }
      } else {
        routes = <NoInternetConnection />;
      }
    }
    const startAnimation = (
      <div className={classes.AnimationWrapper}>
        <Ghost />
      </div>
    );
    return (
      <div style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover' }}>
        {
          this.state.content
            ? (
              <Layout>
                {routes}
              </Layout>
            )
            : (
              <div>
                {startAnimation}
              </div>
            )
        }
      </div>
    );
  }
}

App.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  checkInternet: PropTypes.func.isRequired,
  internet: PropTypes.bool.isRequired,
  internetChecking: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isAuth: !!state.auth.userData.csk,
  internetChecking: state.common.internetChecking,
  internet: state.common.internet
});

const mapDispatchToProps = dispatch => ({
  checkInternet: () => dispatch(checkInternet())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
