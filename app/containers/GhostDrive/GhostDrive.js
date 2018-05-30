import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { saveAs } from 'file-saver';

import { ROOT_HASH } from '../../utils/const';
import * as actionTypes from '../../store/actions';
import PageWithInfoPanel from '../PageWithInfoPanel/PageWithInfoPanel';
import GhostFolders from '../../components/PagesSections/GhostDrive/GhostFolders/GhostFolders';
import GhostFiles from '../../components/PagesSections/GhostDrive/GhostFiles/GhostFiles';
import b64toBlob from '../../utils/b64toBlob';

import css from './GhostDrive.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class GhostDrive extends Component {
  state = {
    checkedFolder: ROOT_HASH,
    nameThatMayChange: 'root',
    checkedFile: '',
    showRemoveButton: false,
    timepickerDate: new Date()
  };
  componentWillMount() {
    //  get all raft data on auth
    this.props.getUserData(this.props.userData, this.props.raftNode);
  }
  //  if user checks one of folders
  handleCheckFolder = name => {
    const checkedFolder = Object.keys(this.props.folders).find(el => (
      this.props.folders[el].name === name
    ));
    return this.setState({
      checkedFolder,
      nameThatMayChange: this.props.folders[checkedFolder].name,
      checkedFile: '',
      showRemoveButton: false
    });
  };
  //  create new folder
  handleCreateNewFolder = () => {
    const defaultNameFolders = _.pickBy(this.props.folders, v => v.name.indexOf('New Folder') >= 0);
    const newFolderName = `New Folder${Object.keys(defaultNameFolders).length
      ? ` (${Object.keys(defaultNameFolders).length})`
      : ''}`;
    return this.props.createNewFolder(newFolderName, this.props.userData, this.props.raftNode);
  };
  //  edit folders name
  handleChangeOnNameThatMayChange = nameThatMayChange => this.setState({ nameThatMayChange });
  //  submit eddited folder
  handleFolderNameEdit = () => {
    if (this.state.nameThatMayChange) {
      this.props.editFolder(
        this.state.checkedFolder,
        this.state.nameThatMayChange,
        this.props.userData,
        this.props.raftNode
      );
    }
    this.setState({ checkedFolder: ROOT_HASH, nameThatMayChange: 'root' });
  };
  //  delete checked folder
  handleDeleteFolder = name => {
    const folderId = Object.keys(this.props.folders).find(el => (
      this.props.folders[el].name === name
    ));
    this.props.deleteFolder(folderId, this.props.userData, this.props.raftNode);
    this.setState({ checkedFolder: ROOT_HASH, nameThatMayChange: 'root' });
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
  //  triggers through redux action electron listener "file:download" that'll save file in RAM
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
  //  get downloaded file from RAM
  handleSaveDownloadedFile = () => {
    const blob = b64toBlob(this.props.downloadedFile.base64File);
    const filesaver = saveAs(blob, this.props.downloadedFile.name);
    filesaver.onwriteend = () => this.props.saveDownloadedFile();
    return filesaver;
  };
  //  toggles confirmation button visibility
  toggleShowRemoveButton = () => {
    if (!this.state.checkedFile) {
      return false;
    }
    return this.setState({ showRemoveButton: !this.state.showRemoveButton });
  };
  //  handles checked file remove
  handleRemoveFile = () => {
    if (!this.state.checkedFile) {
      return false;
    }
    this.props.removeFile(
      this.state.checkedFile,
      this.props.userData,
      this.props.raftNode
    );
    return this.setState({ showRemoveButton: false });
  };
  //  set timepicker date
  handleTimepickerChange = timepickerDate => this.setState({ timepickerDate });
  //  set file timebomb
  handleSetTimebomb = () => console.log('timebomb');
  render() {
    if (!this.props.downloadedFile.downloaded) {
      this.handleSaveDownloadedFile();
    }
    return (
      <PageWithInfoPanel
        disableManipulationButtons={!this.state.checkedFile}
        showRemoveButton={this.state.showRemoveButton}
        toggleShowRemoveButton={() => this.toggleShowRemoveButton()}
        onTopManipulationButtonClick={() => this.handleDownloadFile()}
        onBottomManipulationButtonClick={() => this.handleRemoveFile()}
        timepickerDate={this.state.timepickerDate}
        onTimepickerChange={date => this.handleTimepickerChange(date)}
        onTimebombSet={() => this.handleSetTimebomb()}
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
              onFolderCheck={name => this.handleCheckFolder(name)}
              onCreateFolder={() => this.handleCreateNewFolder()}
              onFolderDelete={name => this.handleDeleteFolder(name)}
              activeFolder={this.props.folders[this.state.checkedFolder].name}
              nameThatMayChange={this.state.nameThatMayChange}
              onNameThatMayChange={val => this.handleChangeOnNameThatMayChange(val)}
              onFolderNameEdit={() => this.handleFolderNameEdit()}
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
  getUserData: PropTypes.func.isRequired,
  deleteFolder: PropTypes.func.isRequired,
  uploadFiles: PropTypes.func.isRequired,
  downloadFile: PropTypes.func.isRequired,
  removeFile: PropTypes.func.isRequired,
  downloadedFile: PropTypes.shape().isRequired,
  saveDownloadedFile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  userData: state.auth.userData,
  raftNode: state.digest.digestInfo.raftNodes[0],
  storageNodes: state.digest.digestInfo.storageNodes,
  folders: state.raft.folders,
  files: state.raft.files,
  downloadedFile: state.raft.downloadedFile
});

const mapDispatchToProps = dispatch => ({
  getUserData: (userData, raftNode) => dispatch(actionTypes.getUserData(userData, raftNode)),
  createNewFolder: (newFolderName, userData, raftNode) => (
    dispatch(actionTypes.createNewFolder(newFolderName, userData, raftNode))
  ),
  editFolder: (signature, newName, userData, raftNode) => (
    dispatch(actionTypes.editFolder(signature, newName, userData, raftNode))
  ),
  deleteFolder: (signature, userData, raftNode) => (
    dispatch(actionTypes.deleteFolder(signature, userData, raftNode))
  ),
  uploadFiles: (userData, files, storageNodes, raftNode) => (
    dispatch(actionTypes.uploadFiles(userData, files, storageNodes, raftNode))
  ),
  downloadFile: (signature, userData, raftNode) => (
    dispatch(actionTypes.downloadFile(signature, userData, raftNode))
  ),
  saveDownloadedFile: () => dispatch(actionTypes.saveDownloadedFile()),
  removeFile: (signature, userData, raftNode) => (
    dispatch(actionTypes.removeFile(signature, userData, raftNode))
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(GhostDrive);
