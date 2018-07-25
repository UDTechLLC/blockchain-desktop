import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import IdleTimer from 'react-idle-timer';
import { Offline, Online } from 'react-detect-offline';

import Layout from './hoc/Layout/Layout';
import NoInternetConnection from './components/PagesSections/NoInternetConnection/NoInternetConnection';
import Homepage from './containers/Homepage/Homepage';
import GhostDrive from './containers/GhostDrive/GhostDrive';
import GhostNote from './containers/GhostNote/GhostNote';
import Wallet from './containers/Wallet/Wallet';
import Settings from './containers/Settings/Settings';
import SearchResults from './containers/SearchResults/SearchResults';
import Logout from './containers/Homepage/Logout/Logout';
import Ghost from './components/Animations/Ghost/Ghost';

import { bg } from './assets/img/img';
import classes from './App.css';

class App extends Component {
  state = { content: false };
  //  stop animation
  componentWillMount() { setTimeout(() => this.setState({ content: true }), 1649); }
  //  auto logout after IdleTimer timeout if user is auth
  onIdle = () => { if (this.props.isAuth) this.props.history.replace('/logout'); };
  render() {
    let routes = (
      <Switch>
        <Route path="/" component={Homepage} key={Math.random()} />
        <Redirect to="/" />
      </Switch>
    );
    if (this.props.isAuth) {
      routes = (
        <Switch>
          <Route exact path="/ghost-drive" component={GhostDrive} key={Math.random()} />
          <Route exact path="/ghost-note" component={GhostNote} key={Math.random()} />
          <Route exact path="/account" component={Settings} key={Math.random()} />
          <Route exact path="/wallet" component={Wallet} key={Math.random()} />
          <Route exact path="/search-results" component={SearchResults} key={Math.random()} />
          <Route exact path="/logout" component={Logout} key={Math.random()} />
          <Redirect to="/ghost-drive" />
        </Switch>
      );
    }
    let content = (<div className={classes.AnimationWrapper}><Ghost /></div>);
    if (this.state.content) {
      content = (
        <div>
          <Online>
            <Layout history={this.props.history}>{routes}</Layout>
          </Online>
          <Offline>
            <NoInternetConnection />
          </Offline>
        </div>
      );
    }
    return (
      // ref={ref => { this.idleTimer = ref; }}
      <IdleTimer onIdle={this.onIdle} timeout={1000 * 60 * 15}>
        <div style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover' }}>
          {content}
        </div>
      </IdleTimer>
    );
  }
}

App.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  isAuth: !!state.auth.userData.csk
});

export default withRouter(connect(mapStateToProps)(App));
