import React from 'react';
import PropTypes from 'prop-types';

import AddButton from '../../../UI/AddButton/AddButton';
import FolderItem from './FodlerItem/FodlerItem';
import WithCustomScrollbar from '../../../../components/UI/WithCustomScrollbar/WithCustomScrollbar';

import css from './GhostFolders.css';
import commonCss from '../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const ghostFolders = props => (
  <WithCustomScrollbar>
    <div
      className={[
        styles.flex,
        styles.wh100,
        styles.GhostFolders
      ].join(' ')}
    >
      <AddButton onClick={() => props.onCreateFolder()} />
      {
        Object.keys(props.folders).map((key, i) => (
          <FolderItem
            key={i}
            folder={props.folders[key]}
            onFolderCheck={name => props.onFolderCheck(name)}
            isActive={props.folders[key].name === props.activeFolder}
            onDelete={name => props.onFolderDelete(name)}
          />
        ))
      }
    </div>
  </WithCustomScrollbar>
);

ghostFolders.propTypes = {
  folders: PropTypes.shape(),
  onFolderCheck: PropTypes.func.isRequired,
  activeFolder: PropTypes.string.isRequired,
  onCreateFolder: PropTypes.func.isRequired,
  onFolderDelete: PropTypes.func.isRequired
};

ghostFolders.defaultProps = {
  folders: {}
};

export default ghostFolders;
