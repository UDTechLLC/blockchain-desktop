import React from 'react';
import PropTypes from 'prop-types';

import css from './FodlerItem.css';
import commonCss from '../../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const ghostFolders = props => (
  <div className={styles.w100}>
    <button onClick={() => props.onFolderCheck(props.folder.name)}>
      {/* <div></div> */}
      <div>
        {props.folder.name}
      </div>
    </button>
  </div>
);

ghostFolders.propTypes = {
  folder: PropTypes.shape().isRequired,
  onFolderCheck: PropTypes.func.isRequired
};

export default ghostFolders;
