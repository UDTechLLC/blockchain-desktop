import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AddButton from '../../../UI/AddButton/AddButton';
import FolderItem from './FodlerItem/FodlerItem';
import WithCustomScrollbar from '../../../../components/UI/WithCustomScrollbar/WithCustomScrollbar';

import css from './GhostFolders.css';
import commonCss from '../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class GhostFolders extends Component {
  render() {
    return (
      <WithCustomScrollbar>
        <div
          className={[
            styles.flexColumn,
            styles.flex0050,
            styles.paddingSm,
            styles.FoldersBlock
          ].join(' ')}
        >
          <div
            className={[
              styles.flex,
              styles.wh100,
              styles.GhostFolders
            ].join(' ')}
          >
            <AddButton onClick={this.props.onCreateFolder} />
            {
              Object.keys(this.props.folders).map((key, i) => (
                <FolderItem
                  key={i}
                  folder={this.props.folders[key]}
                  onFolderCheck={id => this.props.onFolderCheck(id)}
                  isActive={key === this.props.activeFolder}
                  onRemove={id => this.props.onFolderRemove(id)}
                  nameThatMayChange={this.props.nameThatMayChange}
                  onNameThatMayChange={val => this.props.onNameThatMayChange(val)}
                  onFolderNameEdit={this.props.onFolderNameEdit}
                />
              ))
            }
          </div>
        </div>
      </WithCustomScrollbar>
    );
  }
}

GhostFolders.propTypes = {
  folders: PropTypes.shape().isRequired,
  onFolderCheck: PropTypes.func.isRequired,
  activeFolder: PropTypes.string.isRequired,
  onCreateFolder: PropTypes.func.isRequired,
  onFolderRemove: PropTypes.func.isRequired,
  nameThatMayChange: PropTypes.string.isRequired,
  onNameThatMayChange: PropTypes.func.isRequired,
  onFolderNameEdit: PropTypes.func.isRequired
};

export default GhostFolders;
