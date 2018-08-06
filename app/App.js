import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import { checkInternet } from './store/actions/index';
import Layout from './hoc/Layout/Layout';
import NoInternetConnection from './components/PagesSections/NoInternetConnection/NoInternetConnection';
import Homepage from './containers/Homepage/Homepage';
import GhostDrive from './containers/GhostDrive/GhostDrive';
import Wallet from './containers/Wallet/Wallet';
import Settings from './containers/Settings/Settings';
import GhostNote from './containers/GhostNote/GhostNote';
import Logout from './containers/Homepage/Logout/Logout';
// import Ghost from './components/Animations/Ghost/Ghost';

import { bg } from './assets/img/img';

class App extends Component {
  componentWillMount() {
    this.props.checkInternet();
  }

  render() {
    let routes = (
      <Switch>
        <Route path="/" component={Homepage} key={Math.random()} />
        <Redirect to="/" />
      </Switch>
    );
    if (this.props.isAuth && this.props.internet) {
      routes = (
        <Switch>
          <Route exact path="/drive" component={GhostDrive} key={Math.random()} />
          <Route exact path="/note" component={GhostNote} key={Math.random()} />
          <Route exact path="/account" component={Settings} key={Math.random()} />
          <Route exact path="/wallet" component={Wallet} key={Math.random()} />
          <Route exact path="/logout" component={Logout} key={Math.random()} />
          <Redirect to="/drive" />
        </Switch>
      );
    } else if (!this.props.internet) {
      routes = <NoInternetConnection />;
    }
    return (
      <div style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover' }}>
        <Layout>
          {routes}
        </Layout>
      </div>
    );
  }
}

App.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  checkInternet: PropTypes.func.isRequired,
  internet: PropTypes.bool.isRequired
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
