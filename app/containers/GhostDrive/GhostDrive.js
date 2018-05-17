import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actionTypes from '../../store/actions';
import PageWithInfoPanel from '../PageWithInfoPanel/PageWithInfoPanel';
import GhostFolders from '../../components/PagesSections/GhostDrive/GhostFolders/GhostFolders';
import GhostFiles from '../../components/PagesSections/GhostDrive/GhostFiles/GhostFiles';

import css from './GhostDrive.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class GhostDrive extends Component {
  state = {
    checkedFolder: '175aeb081e74c9116ac7f6677c874ff6963ce1f5'
  };
  componentWillMount() {
    this.props.getUserData(this.props.userData, this.props.raftNode);
  }
  handleDeleteFolder = name => {
    this.setState({ checkedFolder: '175aeb081e74c9116ac7f6677c874ff6963ce1f5' }, () => {
      const folderId = Object.keys(this.props.folders).find(el => (
        this.props.folders[el].name === name
      ));
      this.props.deleteFolder(folderId, this.props.userData, this.props.raftNode);
    });
  };
  render() {
    console.log(this.state.checkedFolder, this.props.folders);
    const files = _.pick(this.props.files, 'parentFolder', this.state.checkedFolder);
    return (
      <PageWithInfoPanel
        leftColumn={[
          'CreateFolder',
          'NavMenu'
          ]}
      >
        <div
          className={[
            styles.wh100,
            styles.flex
          ].join(' ')}
        >
          <div
            className={styles.flex1}
          >
            <GhostFolders
              folders={this.props.folders}
              onFolderCheck={name => this.setState({
                checkedFolder: Object.keys(this.props.folders).find(el => (
                  this.props.folders[el].name === name
                ))
              })}
              onFolderDelete={name => this.handleDeleteFolder(name)}
              activeFolder={this.props.folders[this.state.checkedFolder].name}
            />
          </div>
          <div
            className={styles.flex3}
          >
            {
              Object.keys(files).length > 0
                ? <GhostFiles files={files} />
                : (
                  <div
                    className={[
                      styles.flexAllCenter,
                      styles.wh100
                    ].join(' ')}
                  >
                    There is no files in {this.props.folders[this.state.checkedFolder].name} folder.
                  </div>
                )
            }

          </div>
        </div>
      </PageWithInfoPanel>
    );
  }
}

GhostDrive.propTypes = {
  userData: PropTypes.shape().isRequired,
  raftNode: PropTypes.string.isRequired,
  folders: PropTypes.shape().isRequired,
  files: PropTypes.shape().isRequired,
  getUserData: PropTypes.func.isRequired,
  deleteFolder: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  userData: state.auth.userData,
  raftNode: state.digest.digestInfo.raftNodes[0],
  folders: state.raft.folders,
  files: state.raft.files
});

const mapDispatchToProps = dispatch => ({
  getUserData: (userData, raftNode) => dispatch(actionTypes.getUserData(userData, raftNode)),
  deleteFolder: (folderId, userData, raftNode) => (
    dispatch(actionTypes.deleteFolder(folderId, userData, raftNode))
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(GhostDrive);
