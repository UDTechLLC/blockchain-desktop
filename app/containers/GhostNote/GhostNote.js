import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../store/actions';
import PageWithInfoPanel from '../PageWithInfoPanel/PageWithInfoPanel';
import NotesList from '../../components/PagesSections/GhostNote/NotesList/NotesList';
import NoteText from '../../components/PagesSections/GhostNote/NoteText/NoteText';

import css from './GhostNote.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class GhostNote extends Component {
  state = {
    activeNote: {},
    showRemoveButton: false
  };
  componentWillMount() {
    if (this.props.notes && Object.keys(this.props.notes).length) {
      const firstKey = Object.keys(this.props.notes)[0];
      this.setState({
        activeNote: this.props.notes[firstKey]
      });
    }
  }
  handleNoteCheck = signature => {
    this.setState({
      activeNote: this.props.notes[signature],
      showRemoveButton: false
    });
  };
  handleCreateNote = () => this.props.createNote(this.props.userData, this.props.raftNode);
  handleNoteTextChange = text => {
    let name = 'Add Title';
    if (text && text.match(/\n/)) {
      name = text.substr(0, text.match(/\n/).index);
    } else if (text) {
      name = text;
    }
    this.setState({
      activeNote: {
        ...this.state.activeNote,
        text,
        name
      }
    });
  };
  handleEditNote = () => {
    const noteUpdateData = {
      name: this.state.activeNote.name,
      text: this.state.activeNote.text
    };
    this.props.editNote(
      this.state.activeNote.id,
      noteUpdateData,
      this.props.userData,
      this.props.raftNode
    );
    this.setState({ showRemoveButton: false });
  };
  handleRemoveNote = () => {
    this.props.removeNote(this.state.activeNote.id, this.props.userData, this.props.raftNode);
    this.setState({ activeNote: {}, showRemoveButton: false });
  };
  toggleShowRemoveButton = () => {
    this.setState({
      showRemoveButton: !this.state.showRemoveButton
    });
  };
  render() {
    return (
      <PageWithInfoPanel
        columns={[
          'SecurityLayer',
          'NoteManipulation'
        ]}
        handleEditNote={() => this.handleEditNote()}
        handleRemoveNote={() => this.handleRemoveNote()}
        disableManipulationButtons={!Object.keys(this.state.activeNote)}
        showRemoveButton={this.state.showRemoveButton}
        toggleShowRemoveButton={() => this.toggleShowRemoveButton()}
      >
        <div
          className={[
            styles.wh100,
            styles.flex
          ].join(' ')}
        >
          <div className={styles.flex1}>
            <NotesList
              notes={this.props.notes}
              activeNote={this.state.activeNote}
              onNoteCheck={signature => this.handleNoteCheck(signature)}
              onCreateNote={() => this.handleCreateNote()}
            />
          </div>
          <div className={styles.flex3}>
            <NoteText
              text={this.state.activeNote.text}
              disabled={!this.state.activeNote.id}
              onNoteTextChange={(val) => this.handleNoteTextChange(val)}
            />
          </div>
        </div>
      </PageWithInfoPanel>
    );
  }
}

GhostNote.propTypes = {
  notes: PropTypes.shape(),
  userData: PropTypes.shape().isRequired,
  raftNode: PropTypes.string.isRequired,
  createNote: PropTypes.func.isRequired,
  editNote: PropTypes.func.isRequired,
  removeNote: PropTypes.func.isRequired
};

GhostNote.defaultProps = {
  notes: {}
};

const mapStateToProps = state => ({
  notes: state.raft.notes,
  userData: state.auth.userData,
  raftNode: state.digest.digestInfo.raftNodes[0]
});

const mapDispatchToProps = dispatch => ({
  createNote: (userData, raftNode) => dispatch(actions.createNote(userData, raftNode)),
  editNote: (signature, noteUpdateData, userData, raftNode) => (
    dispatch(actions.editNote(signature, noteUpdateData, userData, raftNode))
  ),
  removeNote: (signature, userData, raftNode) => (
    dispatch(actions.removeNote(signature, userData, raftNode))
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(GhostNote);
