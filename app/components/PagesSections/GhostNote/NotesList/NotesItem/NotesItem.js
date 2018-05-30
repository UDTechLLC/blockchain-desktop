import React from 'react';
import PropTypes from 'prop-types';

import { folderI, folderA } from '../../../../../assets/img/img';
import css from './NotesItem.css';
import cornersCss from '../../../../../assets/css/corners.css';
import commonCss from '../../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...cornersCss, ...css };

const notesItem = props => (
  <button
    type="button"
    className={[
      styles.w100,
      styles.transparentButton,
      styles.NotesItem
    ].join(' ')}
    onClick={() => props.onNoteCheck(props.note.id)}
  >
    <div
      className={[
        styles.absolute100,
        styles.flexColumn,
        styles.justifyEnd,
        styles.alignCenter,
        styles.blue,
        !props.isActive ? null : styles.Active
      ].join(' ')}
      style={{ backgroundImage: `url(${!props.isActive ? folderI : folderA})` }}
    >
      <div className={styles.flex5} />
      <div
        className={[
          styles.flex1,
          styles.w100
        ].join(' ')}
      >
        {props.changedTitle || props.note.name}
      </div>
    </div>
    <div
      className={[
        styles.absolute100,
        styles.corners,
        styles.Corners
      ].join(' ')}
    >
      <div /><div />
    </div>
  </button>
);

notesItem.propTypes = {
  note: PropTypes.shape().isRequired,
  onNoteCheck: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  changedTitle: PropTypes.string
};

notesItem.defaultProps = {
  changedTitle: null
};

export default notesItem;
