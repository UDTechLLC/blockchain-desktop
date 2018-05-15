import React from 'react';
import PropTypes from 'prop-types';

import css from './FodlerItem.css';
import commonCss from '../../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const ghostFolders = props => (
  <div className={styles.w100}>
    {props.folder.name}
  </div>
);

ghostFolders.propTypes = {
  folder: PropTypes.shape().isRequired
};

export default ghostFolders;
