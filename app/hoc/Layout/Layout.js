import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Aux from '../Aux/Aux';
import Header from '../../components/Header/Header';

import css from './Layout.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class Layout extends Component {
  render() {
    return (
      <Aux>
        <div className={[styles.wh100, styles.Layout].join(' ')}>
          <Header
            isAuth={this.props.isAuth}
            loading={this.props.loading}
            history={this.props.history}
          />
          <main className={[styles.w100, styles.relative].join(' ')}>
            <article className={[styles.wh100, styles.flexColumn, styles.justifyCenter].join(' ')}>
              { this.props.children }
            </article>
          </main>
        </div>
      </Aux>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  isAuth: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  history: PropTypes.shape({}).isRequired
};

const mapStateToProps = state => ({
  isAuth: !!state.auth.userData.csk,
  loading: state.common.loading || state.raft.loading || state.auth.loading
    || state.blockchain.loading
});

export default connect(mapStateToProps)(Layout);
