import React from 'react';
import PropTypes from 'prop-types';

import { /* xFileRed,  xFileBlue */ } from '../../../../../assets/img/img';
import css from './FileItem.css';
import commonCss from '../../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const fileItem = props => (
  <div
    className={[
      styles.FileItem
    ].join(' ')}
  >
    <div
      className={[
        styles.absolute100,
        styles.flexAllCenter
      ].join(' ')}
    >
      {props.file.name}
    </div>
  </div>
);

fileItem.propTypes = {
  file: PropTypes.shape().isRequired
};

export default fileItem;
