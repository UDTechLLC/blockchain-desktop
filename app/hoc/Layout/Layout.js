import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classes from './Layout.css';

import Aux from '../Aux/Aux';
import Header from '../../components/Header/Header';
// import Footer from '../../components/Footer/Footer';

class Layout extends Component {
  render() {
    return (
      <Aux>
        <div className={classes.Layout}>
          <Header
            isAuth={this.props.isAuth}
            loading={this.props.loading}
          />
          <main>
            <article>
              { this.props.children }
            </article>
          </main>
          {/*
          <Footer
            isAuth={this.props.isAuth}
            balance={this.props.balance}
          />
          {
            this.props.isAuth
              ? <Footer />
              : null
          }
          */}
        </div>
      </Aux>
    );
  }
}

Layout.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
  // balance: PropTypes.number
  loading: PropTypes.bool.isRequired
};

// Layout.defaultProps = {
//   balance: 0
// };

const mapStateToProps = state => ({
  isAuth: state.auth.userData.csk !== null,
  balance: state.blockchain.balance,
  bcNodes: state.digest.digestInfo.bcNodes,
  loading: state.auth.loading || state.blockchain.loading || state.commonInfo.loading
    || state.digest.loading || state.raft.loading
});

export default connect(mapStateToProps)(Layout);
