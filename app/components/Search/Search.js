import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

import { loop } from '../../assets/img/img';
import css from './Search.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class Search extends Component {
  state = {
    showInput: false
  };
  toggleButton2Input = () => this.setState({ showInput: !this.state.showInput });
  handleSearchThoughFiles = searchText => this.props.setSearchWord(searchText);
  render() {
    const button = (
      <button
        type="button"
        onClick={() => this.toggleButton2Input()}
        className={[
          styles.transparentButton,
          styles.OpenButton
        ].join(' ')}
      >
        <img src={loop} alt="search" height={18} />
      </button>
    );
    const input = (
      <div
        className={[
          styles.InputWrapper
        ].join(' ')}
      >
        <input
          type="text"
          placeholder="Search ..."
          value={this.props.searchText}
          onChange={e => this.handleSearchThoughFiles(e.target.value)}
          className={[
            styles.lightBlueBg,
            styles.blue,
            styles.Input
          ].join(' ')}
        />
        <button
          type="button"
          onClick={() => this.toggleButton2Input()}
          className={[
            styles.transparentButton,
            styles.CloseButton
          ].join(' ')}
        >
          x
        </button>
      </div>
    );
    return (
      <div>
        {
          !this.state.showInput
            ? button
            : input
        }
      </div>
    );
  }
}

Search.propTypes = {
  searchText: PropTypes.string,
  setSearchWord: PropTypes.func.isRequired
};

Search.defaultProps = {
  searchText: ''
};

const mapStateToProps = state => ({
  searchText: state.search.searchText
});

const mapDispatchToProps = dispatch => ({
  setSearchWord: searchText => dispatch(actions.setSearchWord(searchText))
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
