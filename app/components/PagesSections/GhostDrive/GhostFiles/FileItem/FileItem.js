import React from 'react';
import PropTypes from 'prop-types';

import css from './FileItem.css';
import commonCss from '../../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const fileItem = props => (
  <div className={styles.FileItem}>
    {props.file.name}
  </div>
);

fileItem.propTypes = {
  file: PropTypes.shape().isRequired
};

export default fileItem;
