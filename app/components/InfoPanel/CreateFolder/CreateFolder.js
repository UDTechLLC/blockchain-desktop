import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actionTypes from '../../../store/actions';

class CreateFolder extends Component {
  render() {
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          // eslint-disable-next-line max-len
          return this.props.createNewFolder(this.state.newFolderName, this.props.userData, this.props.raftNode);
        }}
      >
        <input type="text" onChange={e => this.setState({ newFolderName: e.target.value })} />
        <button>
          create new folder
        </button>
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
