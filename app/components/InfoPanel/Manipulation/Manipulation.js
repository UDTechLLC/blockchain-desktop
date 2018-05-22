import React from 'react';
import PropTypes from 'prop-types';

import css from './Manipulation.css';
import commonCss from '../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const manipulation = props => (
  <div
    className={[
      styles.wh100,
      styles.flexColumnAllCenter,
      styles.Manipulation
    ].join(' ')}
  >
    <button
      type="button"
      onClick={() => props.handleDownloadFile()}
    >
      download
    </button>
    <button
      type="button"
      onClick={() => props.handleRemoveFile()}
    >
      delete
    </button>
  </div>
);

manipulation.propTypes = {
  handleDownloadFile: PropTypes.func.isRequired,
  handleRemoveFile: PropTypes.func.isRequired
};

export default manipulation;
