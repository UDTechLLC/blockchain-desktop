/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';

import { timestamp2date, bytes2HumanReadableSize } from '../../../../../utils/commonFunctions';
import { xFileBlue } from '../../../../../assets/img/img';
import css from './FileItem.css';
import commonCss from '../../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const fileItem = props => {
  const extension = props.file.name.lastIndexOf('.') > 0 ? props.file.name.substr(props.file.name.lastIndexOf('.') + 1) : null;
  return (
    <div
      role="button"
      tabIndex={0}
      className={[
        styles.FileItem,
        !props.isActive ? null : styles.Active
      ].join(' ')}
      onClick={() => props.onFileCheck(props.file.signature)}
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
            bytes2HumanReadableSize(props.file.size)
              ? bytes2HumanReadableSize(props.file.size)
              : null
          }
        </div>
        <div
          className={[
            styles.flex1,
            styles.flexAllCenter
          ].join(' ')}
        >
          {props.file.name}
        </div>
        <div
          className={[
            styles.flex1,
            styles.flexAllCenter
          ].join(' ')}
        >
          {timestamp2date(props.file.timestamp)}
        </div>
      </div>
    </div>
  );
};

fileItem.propTypes = {
  file: PropTypes.shape().isRequired,
  isActive: PropTypes.bool,
  onFileCheck: PropTypes.func.isRequired
};

fileItem.defaultProps = {
  isActive: false
};

export default fileItem;
