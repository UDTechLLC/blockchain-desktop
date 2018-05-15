import React from 'react';
import PropTypes from 'prop-types';

import FolderItem from './FodlerItem/FodlerItem';

import css from './GhostFolders.css';
import commonCss from '../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const ghostFolders = props => (
  <div className={styles.wh100}>
    {
      Object.keys(props.folders).map((key, i) => <FolderItem key={i} folder={props.folders[key]} />)
    }
  </div>
);

ghostFolders.propTypes = {
  folders: PropTypes.shape(PropTypes.shape()).isRequired
};

export default ghostFolders;
