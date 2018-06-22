import React from 'react';
import PropTypes from 'prop-types';

import AddButton from '../../../UI/AddButton/AddButton';
import NotesItem from './NotesItem/NotesItem';
import WithCustomScrollbar from '../../../../components/UI/WithCustomScrollbar/WithCustomScrollbar';

import css from './NotesList.css';
import commonCss from '../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const notesList = props => (
  <WithCustomScrollbar>
    <div
      className={[
        styles.flex,
        styles.wh100,
        styles.NotesList
      ].join(' ')}
    >
      <AddButton onClick={() => props.onCreateNote()} />
      {
        props.notes && Object.keys(props.notes).length
          ? Object.keys(props.notes).map((key, i) => (
            <NotesItem
              key={i}
              note={props.notes[key]}
              onNoteCheck={signature => props.onNoteCheck(signature)}
              isActive={props.notes[key].id === props.activeNote.id}
              changedTitle={
                props.notes[key].id === props.activeNote.id
                  ? props.activeNote.name
                  : null
              }
            />
            ))
          : null
      }
    </div>
  </WithCustomScrollbar>
);

notesList.propTypes = {
  notes: PropTypes.shape(),
  activeNote: PropTypes.string,
  onCreateNote: PropTypes.func.isRequired,
  onNoteCheck: PropTypes.func.isRequired
};

notesList.defaultProps = {
  notes: {},
  activeNote: ''
};

export default notesList;
