/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { timestamp2date, bytes2HumanReadableSize, getFileName, getFileExtension } from '../../../../../utils/utils';
import { xFileBlue } from '../../../../../assets/img/img';
import css from './FileItem.css';
import commonCss from '../../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class FileItem extends Component {
  state = {
    hide: false,
    oldGhostTime: this.props.file.ghostTime
  };
  componentWillMount() {
    this.setGhostTime();
  }
  setGhostTime = () => {
    if (this.props.file && typeof this.props.file === 'object' && this.props.file.ghostTime) {
      const now = new Date().getTime();
      const dif = this.props.file.ghostTime - now;
      if (dif > 0) {
        this.setState({ hide: true, oldGhostTime: this.props.file.ghostTime }, () => (
          setTimeout(() => this.setState({ hide: false }), dif)
        ));
      }
    }
  };
  render() {
    if (this.state.oldGhostTime !== this.props.file.ghostTime) this.setGhostTime();

    const extension = getFileExtension(this.props.file.name);
    const cleanName = getFileName(this.props.file.name);

    return (
      <div
        role="button"
        tabIndex={0}
        className={[
          styles.marginSmBottom,
          styles.relative,
          styles.blue,
          styles.FileItem,
          !this.props.isActive ? undefined : styles.Active
        ].join(' ')}
        onClick={() => this.props.onFileCheck(this.props.file.signature)}
        style={{ display: this.state.hide ? 'none' : 'inherit' }}
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
                : undefined
            }
          </div>
          <div
            className={[
              styles.flex1,
              styles.flexAllCenter
            ].join(' ')}
          >
            {cleanName}
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
