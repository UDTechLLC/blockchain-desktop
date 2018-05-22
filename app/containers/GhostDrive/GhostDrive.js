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
    checkedFolder: '175aeb081e74c9116ac7f6677c874ff6963ce1f5',
    checkedFile: ''
  };
  componentWillMount() {
    this.props.getUserData(this.props.userData, this.props.raftNode);
  }
  handleCheckFolder = name => (
    this.setState({
      checkedFolder: Object.keys(this.props.folders).find(el => (
        this.props.folders[el].name === name
      )),
      checkedFile: ''
    })
  );
  handleCheckFile = signature => (
    this.setState({
      checkedFile: Object.keys(this.props.files).find(el => (
        this.props.files[el].signature === signature
      ))
    })
  );
  handleDeleteFolder = name => {
    this.setState({ checkedFolder: '175aeb081e74c9116ac7f6677c874ff6963ce1f5' }, () => {
      const folderId = Object.keys(this.props.folders).find(el => (
        this.props.folders[el].name === name
      ));
      this.props.deleteFolder(folderId, this.props.userData, this.props.raftNode);
    });
  };
  handleOnDropFile = (accepted, rejected) => {
    if (rejected.length) {
      console.log(rejected);
    }
    const timestamp = Math.round(+new Date() / 1000);
    const promises = _.map(accepted, file => (new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => resolve({
        name: file.name,
        parentFolder: this.state.checkedFolder,
        size: file.size,
        data: event.target.result,
        timestamp
      });
    })));
    return Promise.all(promises)
      .then(files => (
        this.props.uploadFiles(
          this.props.userData,
          files,
          this.props.storageNodes,
          this.props.raftNode
        )
      ))
      .catch(error => console.log(error));
  };
  handleDownloadFile = () => {
    if (!this.state.checkedFile) {
      return false;
    }
    return this.props.downloadFile(
      this.state.checkedFile,
      this.props.userData,
      this.props.raftNode
    );
  };
  handleRemoveFile = () => {
    if (!this.state.checkedFile) {
      return false;
    }
    return this.props.removeFile(
      this.state.checkedFile,
      this.props.userData,
      this.props.raftNode
    );
  };
  render() {
    return (
      <PageWithInfoPanel
        handleDownloadFile={() => this.handleDownloadFile()}
        handleRemoveFile={() => this.handleRemoveFile()}
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
              onFolderCheck={name => this.handleCheckFolder(name)}
              onFolderDelete={name => this.handleDeleteFolder(name)}
              activeFolder={this.props.folders[this.state.checkedFolder].name}
            />
          </div>
          <div
            className={styles.flex3}
          >
            <GhostFiles
              folderInfo={{
                [this.state.checkedFolder]: this.props.folders[this.state.checkedFolder]
              }}
              files={_.pickBy(this.props.files, v => v.parentFolder === this.state.checkedFolder)}
              onDrop={(accepted, rejected) => this.handleOnDropFile(accepted, rejected)}
              onFileCheck={signature => this.handleCheckFile(signature)}
              activeFile={this.state.checkedFile}
            />
          </div>
        </div>
      </PageWithInfoPanel>
    );
  }
}

GhostDrive.propTypes = {
  userData: PropTypes.shape().isRequired,
  raftNode: PropTypes.string.isRequired,
  storageNodes: PropTypes.arrayOf().isRequired,
  folders: PropTypes.shape().isRequired,
  files: PropTypes.shape().isRequired,
  getUserData: PropTypes.func.isRequired,
  deleteFolder: PropTypes.func.isRequired,
  uploadFiles: PropTypes.func.isRequired,
  downloadFile: PropTypes.func.isRequired,
  removeFile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  userData: state.auth.userData,
  raftNode: state.digest.digestInfo.raftNodes[0],
  storageNodes: state.digest.digestInfo.storageNodes,
  folders: state.raft.folders,
  files: state.raft.files
});

const mapDispatchToProps = dispatch => ({
  getUserData: (userData, raftNode) => dispatch(actionTypes.getUserData(userData, raftNode)),
  deleteFolder: (folderId, userData, raftNode) => (
    dispatch(actionTypes.deleteFolder(folderId, userData, raftNode))
  ),
  uploadFiles: (userData, files, storageNodes, raftNode) => (
    dispatch(actionTypes.uploadFiles(userData, files, storageNodes, raftNode))
  ),
  downloadFile: (signature, userData, raftNode) => (
    dispatch(actionTypes.downloadFile(signature, userData, raftNode))
  ),
  saveDownloadedFile: signature => dispatch(actionTypes.saveDownloadedFile(signature)),
  removeFile: (signature, userData, raftNode) => (
    dispatch(actionTypes.removeFile(signature, userData, raftNode))
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(GhostDrive);
