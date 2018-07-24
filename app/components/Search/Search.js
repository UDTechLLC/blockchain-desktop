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
    inputText: undefined,
    showInput: false
  };
  toggleButton2Input = () => {
    this.setState({ showInput: !this.state.showInput, inputText: undefined }, () => {
      if (this.state.showInput) this.searchInput.focus();
      this.handleSetSearchText();
    });
  };
  handleSetSearchText = _.debounce(() => {
    if (this.state.inputText.length >= 3) {
      this.props.setSearchText(this.state.inputText, {
        folders: this.props.folders,
        files: this.props.files,
        notes: this.props.notes
      });

      if (this.props.history.location.pathname.toString() !== '/search-results') {
        return this.props.history.push('/search-results');
      }
    } else if (this.props.history.location.pathname.toString() === '/search-results' && !this.state.inputText) {
      this.props.history.goBack();
    }
  }, 400);
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
          value={this.state.inputText}
          onChange={e => (
            this.setState({ inputText: e.target.value }, this.handleSetSearchText)
          )}
          // eslint-disable-next-line no-shadow
          ref={input => { this.searchInput = input; }}
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
  setSearchText: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
    goBack: PropTypes.func,
    location: PropTypes.shape({
      pathname: PropTypes.string
    }),
  }).isRequired,
  folders: PropTypes.shape({}).isRequired,
  files: PropTypes.shape({}).isRequired,
  notes: PropTypes.shape({}).isRequired
};

const mapStateToProps = state => ({
  searchText: state.search.searchText,
  folders: state.raft.folders,
  files: state.raft.files,
  notes: state.raft.notes
});

const mapDispatchToProps = dispatch => ({
  setSearchText: (searchText, searchObj) => dispatch(actions.setSearchText(searchText, searchObj))
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
