import React, { Component } from 'react';

import { loop } from '../../assets/img/img';
import css from './Search.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class Search extends Component {
  state = {
    showInput: false,
    searchText: ''
  };
  toggleButton2Input = () => this.setState({ showInput: !this.state.showInput });
  handleSearchThoughFiles = searchText => this.setState({ searchText });
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
          value={this.state.searchText}
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

export default Search;
