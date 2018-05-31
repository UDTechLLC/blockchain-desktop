/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { timestamp2date, bytes2HumanReadableSize } from '../../../../../utils/commonFunctions';
import { xFileBlue } from '../../../../../assets/img/img';
import css from './FileItem.css';
import commonCss from '../../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class FileItem extends Component {
  state = {
    hide: false,
    oldTimebomb: this.props.file.timebomb
  };
  componentWillMount() {
    this.setTimebomb();
  }
  setTimebomb = () => {
    if (this.props.file && typeof this.props.file === 'object' && this.props.file.timebomb) {
      const now = +new Date().getTime() / 1000;
      const dif = Math.round(this.props.file.timebomb - now);
      if (dif > 0) {
        const time = dif * 1000;
        this.setState({ hide: true, oldTimebomb: this.props.file.timebomb });
        setTimeout(() => this.setState({ hide: false }), time);
      }
    }
  };
  render() {
    if (this.state.oldTimebomb !== this.props.file.timebomb) {
      this.setTimebomb();
    }
    const extension = this.props.file.name.lastIndexOf('.') > 0
      ? this.props.file.name.substr(this.props.file.name.lastIndexOf('.') + 1)
      : null;
    return (
      <div
        role="button"
        tabIndex={0}
        className={[
          styles.FileItem,
          !this.props.isActive ? null : styles.Active
        ].join(' ')}
        onClick={() => this.props.onFileCheck(this.props.file.signature)}
        style={{
          display: this.state.hide ? 'none' : 'inherit'
        }}
      >
        <div
          className={[
            styles.absolute100,
            styles.flexColumn
          ].join(' ')}
          style={{ backgroundImage: `url(${xFileBlue})` }}
        >
          <div
            className={[
              styles.flex1
            ].join(' ')}
          >
            {extension}
          </div>
          <div
            className={[
              styles.flex3,
              styles.flexAllCenter
            ].join(' ')}
          >
            {
              bytes2HumanReadableSize(this.props.file.size)
                ? bytes2HumanReadableSize(this.props.file.size)
                : null
            }
          </div>
          <div
            className={[
              styles.flex1,
              styles.flexAllCenter
            ].join(' ')}
          >
            {this.props.file.name}
          </div>
          <div
            className={[
              styles.flex1,
              styles.flexAllCenter
            ].join(' ')}
          >
            {timestamp2date(this.props.file.timestamp)}
          </div>
        </div>
      </div>
    );
  }
}

FileItem.propTypes = {
  file: PropTypes.shape().isRequired,
  isActive: PropTypes.bool,
  onFileCheck: PropTypes.func.isRequired
};

FileItem.defaultProps = {
  isActive: false
};

export default FileItem;
