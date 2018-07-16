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
            onFolderCheck={id => props.onFolderCheck(id)}
            isActive={props.folders[key].name === props.activeFolder}
            onDelete={id => props.onFolderDelete(id)}
            nameThatMayChange={props.nameThatMayChange}
            onNameThatMayChange={val => props.onNameThatMayChange(val)}
            onFolderNameEdit={props.onFolderNameEdit}
          />
        ))
      }
    </div>
  </WithCustomScrollbar>
);

ghostFolders.propTypes = {
  folders: PropTypes.shape().isRequired,
  onFolderCheck: PropTypes.func.isRequired,
  activeFolder: PropTypes.string.isRequired,
  onCreateFolder: PropTypes.func.isRequired,
  onFolderDelete: PropTypes.func.isRequired,
  nameThatMayChange: PropTypes.string.isRequired,
  onNameThatMayChange: PropTypes.func.isRequired,
  onFolderNameEdit: PropTypes.func.isRequired
};

export default ghostFolders;
