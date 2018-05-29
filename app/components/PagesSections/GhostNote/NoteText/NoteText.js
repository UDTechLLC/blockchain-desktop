import React from 'react';
import PropTypes from 'prop-types';

import css from './NoteText.css';
import commonCss from '../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const noteText = props => (
  <div
    className={[
      styles.wh100,
      styles.NoteTextWrapper
    ].join(' ')}
  >
    <textarea
      className={[
        styles.wh100
      ].join(' ')}
      value={props.text}
      onChange={e => props.onNoteTextChange(e.target.value)}
    />
  </div>
);

noteText.propTypes = {
  text: PropTypes.string,
  onNoteTextChange: PropTypes.func.isRequired
};

noteText.defaultProps = {
  text: ''
};

export default noteText;
