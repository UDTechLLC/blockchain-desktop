import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { ROOT_HASH } from '../../utils/const';
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
    checkedFolder: ROOT_HASH,
    nameThatMayChange: 'Root',
    checkedFile: undefined,
    showRemoveButton: false,
    timePickerDate: new Date()
  };
  //  if user checks one of folders
  handleCheckFolder = id => {
    const checkedFolders = _.pickBy(this.props.folders, el => (
      el.id === id
    ));

    const checkedFolder = Object.keys(checkedFolders)[0];

    return this.setState({
      checkedFolder,
      nameThatMayChange: checkedFolder ? this.props.folders[checkedFolder].name : 'Root',
      checkedFile: undefined,
      showRemoveButton: false
    });
  };
  //  create new folder
  handleCreateNewFolder = () => {
    const defaultNameFolders = _.pickBy(this.props.folders, v => (
      v.name ? v.name.indexOf('New Folder') >= 0 : false
    ));
    let name = 'New Folder';
    const dnfKeysArr = Object.keys(defaultNameFolders);
    if (dnfKeysArr.length) {
      const last = defaultNameFolders[dnfKeysArr[dnfKeysArr.length - 1]].name;
      const number = +last.substr((last.indexOf('New Folder (') + 12), 1) || NaN;
      const i = !Number.isNaN(number) ? number + 1 : 1;
      name = `New Folder (${i})`;
    }
    return this.props.createNewFolder(name, this.props.userData, this.props.raftNode);
  };
  //  edit folders name
  handleChangeOnNameThatMayChange = nameThatMayChange => this.setState({ nameThatMayChange });
  //  submit eddited folder
  handleFolderNameEdit = () => {
    if (this.state.nameThatMayChange && this.state.nameThatMayChange !== 'Root') {
      const folder = {
        ...this.props.folders[this.state.checkedFolder],
        name: this.state.nameThatMayChange
      };

      this.props.editFolder(folder, this.props.userData, this.props.raftNode);
    }
    this.setState({ checkedFolder: ROOT_HASH, nameThatMayChange: 'Root' });
  };
  //  delete checked folder
  handleRemoveFolder = id => {
    const folders = _.pickBy(this.props.folders, el => (
      el.id === id
    ));
    this.props.removeFolders(folders, this.props.userData, this.props.raftNode);
    this.setState({ checkedFolder: ROOT_HASH, nameThatMayChange: 'Root' });
  };
  //  if user checks one of files
  handleCheckFile = signature => (
    this.setState({
      checkedFile: Object.keys(this.props.files).find(el => (
        this.props.files[el].signature === signature
      )),
      showRemoveButton: false
    })
  );
  //  upload file
  handleOnDropFile = (accepted, rejected) => {
    if (rejected.length) {
      console.log(rejected);
    }
    const timestamp = new Date().getTime();
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
          files,
          this.props.userData,
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
  //  toggles confirmation button visibility
  toggleShowRemoveButton = () => {
    if (!this.state.checkedFile) return false;

    return this.setState({ showRemoveButton: !this.state.showRemoveButton });
  };
  //  handles checked file remove
  handleRemoveFile = () => {
    if (!this.state.checkedFile) return false;

    this.props.removeFiles(
      { [this.state.checkedFile]: this.props.files[this.state.checkedFile] },
      this.props.userData,
      this.props.raftNode
    );

    return this.setState({ showRemoveButton: false });
  };
  //  set file ghost time
  handleSetGhostTime = () => {
    const timestamp = this.state.timePickerDate.getTime();

    this.props.setGhostTime(
      { files: { [this.state.checkedFile]: this.props.files[this.state.checkedFile] } },
      timestamp,
      this.props.userData,
      this.props.raftNode
    );

    this.setState({ checkedFile: undefined });
  };
  render() {
    return (
      <PageWithInfoPanel
        disableManipulationButtons={!this.state.checkedFile}
        showRemoveButton={this.state.showRemoveButton}
        toggleShowRemoveButton={this.toggleShowRemoveButton}
        onTopManBtnClick={this.handleDownloadFile}
        onBottomManBtnClick={this.handleRemoveFile}
        timePickerDate={this.state.timePickerDate}
        onTimePickerChange={timePickerDate => this.setState({ timePickerDate })}
        onGhostTimeSet={this.handleSetGhostTime()}
      >
        <div
          className={[
            styles.wh100,
            styles.flex
          ].join(' ')}
        >
          <div className={styles.flex1}>
            <GhostFolders
              folders={this.props.folders}
              onFolderCheck={id => this.handleCheckFolder(id)}
              onCreateFolder={this.handleCreateNewFolder}
              onFolderDelete={id => this.handleRemoveFolder(id)}
              activeFolder={this.state.checkedFolder}
              nameThatMayChange={this.state.nameThatMayChange}
              onNameThatMayChange={val => this.handleChangeOnNameThatMayChange(val)}
              onFolderNameEdit={this.handleFolderNameEdit}
            />
          </div>
          <div className={styles.flex3}>
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
  storageNodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  folders: PropTypes.shape().isRequired,
  files: PropTypes.shape().isRequired,
  createNewFolder: PropTypes.func.isRequired,
  editFolder: PropTypes.func.isRequired,
  removeFolders: PropTypes.func.isRequired,
  uploadFiles: PropTypes.func.isRequired,
  downloadFile: PropTypes.func.isRequired,
  removeFiles: PropTypes.func.isRequired,
  setGhostTime: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  userData: state.auth.userData,
  raftNode: state.digest.digestInfo.raftNodes[0],
  storageNodes: state.digest.digestInfo.storageNodes,
  folders: state.raft.folders,
  files: state.raft.files
});

const mapDispatchToProps = dispatch => ({
  createNewFolder: (newFolderName, userData, raftNode) => (
    dispatch(actionTypes.createNewFolder(newFolderName, userData, raftNode))
  ),
  editFolder: (folder, userData, raftNode) => (
    dispatch(actionTypes.editFolder(folder, userData, raftNode))
  ),
  removeFolders: (signature, userData, raftNode) => (
    dispatch(actionTypes.removeFolders(signature, userData, raftNode))
  ),
  uploadFiles: (files, userData, storageNodes, raftNode) => (
    dispatch(actionTypes.uploadFiles(files, userData, storageNodes, raftNode))
  ),
  downloadFile: (signature, userData, raftNode) => (
    dispatch(actionTypes.downloadFile(signature, userData, raftNode))
  ),
  removeFiles: (files, userData, raftNode) => (
    dispatch(actionTypes.removeFiles(files, userData, raftNode))
  ),
  setGhostTime: (upd, ghostTime, userData, raftNode) => (
    dispatch(actionTypes.setGhostTime(upd, ghostTime, userData, raftNode))
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(GhostDrive);
