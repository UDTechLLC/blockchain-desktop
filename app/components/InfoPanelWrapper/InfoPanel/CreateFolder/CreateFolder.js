import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actionTypes from '../../../../store/actions/index';
import Button from '../../../UI/Button/Button';

import { folder } from '../../../../assets/img/img';
import css from './CreateFolder.css';
import commonCss from '../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class CreateFolder extends Component {
  state = {
    newFolderName: ''
  };
  render() {
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          // eslint-disable-next-line max-len
          return this.props.createNewFolder(this.state.newFolderName, this.props.userData, this.props.raftNode);
        }}
        className={[
          styles.wh100,
          styles.flexBetweenCenter
        ].join(' ')}
      >
        <label
          htmlFor="info-panel-create-folder"
          className={[
            styles.flex1,
            styles.flexColumnAllCenter,
            styles.LeftColumn
          ].join(' ')}
        >
          <img
            src={folder}
            alt="Create folder"
          />
        </label>
        <div
          className={[
            styles.flex1,
            styles.flexColumn,
            styles.justifyCenter,
            styles.RightColumn
          ].join(' ')}
        >
          <input
            type="text"
            id="info-panel-create-folder"
            onChange={e => this.setState({ newFolderName: e.target.value })}
            value={this.state.newFolderName}
            className={styles.Input}
            placeholder="NEW FOLDER"
          />
          <Button
            disabled={!this.state.newFolderName}
          >
            Create
          </Button>
        </div>
      </form>
    );
  }
}

CreateFolder.propTypes = {
  userData: PropTypes.shape().isRequired,
  raftNode: PropTypes.string.isRequired,
  createNewFolder: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  userData: state.auth.userData,
  raftNode: state.digest.digestInfo.raftNodes[0]
});

const mapDispatchToProps = dispatch => ({
  createNewFolder: (newFolderName, userData, raftNode) => (
    dispatch(actionTypes.createNewFolder(newFolderName, userData, raftNode))
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateFolder);
