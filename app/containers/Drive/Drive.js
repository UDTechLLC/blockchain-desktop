import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { ROOT_HASH } from '../../utils/const';
import * as actionTypes from '../../store/actions';
import InfoPanelWrapper from '../../components/InfoPanelWrapper/InfoPanelWrapper';
import GhostFolders from '../../components/PagesSections/GhostDrive/GhostFolders/GhostFolders';
import GhostFiles from '../../components/PagesSections/GhostDrive/GhostFiles/GhostFiles';

import css from './Drive.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class Drive extends Component {
  state = {
    checkedFolder: ROOT_HASH,
    nameThatMayChange: 'Root',
    checkedFile: null,
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
      checkedFile: null,
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
    const { nameThatMayChange, checkedFolder } = this.state;
    const { folders, editFolder, userData, raftNode } = this.props;

    if (nameThatMayChange && nameThatMayChange !== 'Root') {
      const folder = { ...folders[checkedFolder], name: nameThatMayChange };
      editFolder(folder, userData, raftNode);
    }

    this.setState({ checkedFolder: ROOT_HASH, nameThatMayChange: 'Root' });
  };

  //  delete checked folder
  handleRemoveFolder = id => {
    const { folders, userData, raftNode } = this.props;

    const fldrs = _.pickBy(folders, el => el.id === id);

    this.props.removeFolders(fldrs, userData, raftNode);
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
    if (rejected.length) console.log(rejected);

    const { checkedFolder } = this.state;
    const { uploadFiles, userData, storageNodes, raftNode } = this.props;
    const timestamp = new Date().getTime();

    const promises = _.map(accepted, file => (new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => resolve({
        name: file.name,
        parentFolder: checkedFolder,
        size: file.size,
        data: event.target.result,
        timestamp
      });
    })));

    return Promise.all(promises)
      .then(files => uploadFiles(files, userData, storageNodes, raftNode))
      .catch(error => console.log(error));
  };

  handleDownloadFile = () => {
    if (!this.state.checkedFile) return false;

    const { checkedFile } = this.state;
    const { downloadFile, userData, raftNode } = this.props;

    return downloadFile(checkedFile, userData, raftNode);
  };

  //  toggles confirmation button visibility
  toggleShowRemoveButton = () => {
    if (!this.state.checkedFile) return false;

    return this.setState({ showRemoveButton: !this.state.showRemoveButton });
  };

  //  handles checked file remove
  handleRemoveFile = () => {
    if (!this.state.checkedFile) return false;

    const { checkedFile } = this.state;
    const { removeFiles, files, userData, raftNode } = this.props;

    removeFiles({ [checkedFile]: files[checkedFile] }, userData, raftNode);

    return this.setState({ showRemoveButton: false });
  };

  //  set file ghost time
  handleSetTimeBomb = () => {
    const { timePickerDate, checkedFile } = this.state;
    const { setTimeBomb, files, userData, raftNode } = this.props;

    const timestamp = timePickerDate.getTime();

    setTimeBomb({ files: { [checkedFile]: files[checkedFile] } }, timestamp, userData, raftNode);

    this.setState({ checkedFile: null });
  };

  render() {
    return (
      <InfoPanelWrapper
        disableManBtns={!this.state.checkedFile}
        showRemoveButton={this.state.showRemoveButton}
        toggleShowRemoveBtn={this.toggleShowRemoveButton}
        onTopManBtnClick={this.handleDownloadFile}
        onBottomManBtnClick={this.handleRemoveFile}
        timePickerDate={this.state.timePickerDate}
        onTimePickerChange={timePickerDate => this.setState({ timePickerDate })}
        onGhostTimeSet={this.handleSetGhostTime}
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
              onFolderRemove={id => this.handleRemoveFolder(id)}
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
      </InfoPanelWrapper>
    );
  }
}

Drive.propTypes = {
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
  setTimeBomb: PropTypes.func.isRequired
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
  setTimeBomb: (upd, ghostTime, userData, raftNode) => (
    dispatch(actionTypes.setGhostTime(upd, ghostTime, userData, raftNode))
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(Drive);
