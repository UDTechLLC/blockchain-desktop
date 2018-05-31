import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { folderI, folderA } from '../../../../../assets/img/img';
import css from './NotesItem.css';
import cornersCss from '../../../../../assets/css/corners.css';
import commonCss from '../../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...cornersCss, ...css };

class NotesItem extends Component {
  state = {
    hide: false,
    oldTimebomb: this.props.note.timebomb
  };
  componentWillMount() {
    this.setTimebomb();
  }
  setTimebomb = () => {
    if (this.props.note && typeof this.props.note === 'object' && this.props.note.timebomb) {
      const now = +new Date().getTime() / 1000;
      const dif = Math.round(this.props.note.timebomb - now);
      if (dif > 0) {
        const time = dif * 1000;
        this.setState({ hide: true, oldTimebomb: this.props.note.timebomb });
        setTimeout(() => this.setState({ hide: false }), time);
      }
    }
  };
  render() {
    if (this.state.oldTimebomb !== this.props.note.timebomb) {
      this.setTimebomb();
    }
    return (
      <button
        type="button"
        className={[
          styles.w100,
          styles.transparentButton,
          styles.NotesItem
        ].join(' ')}
        onClick={() => this.props.onNoteCheck(this.props.note.id)}
        style={{
          display: this.state.hide ? 'none' : 'inherit'
        }}
      >
        <div
          className={[
            styles.absolute100,
            styles.flexColumn,
            styles.justifyEnd,
            styles.alignCenter,
            styles.blue,
            !this.props.isActive ? null : styles.Active
          ].join(' ')}
          style={{ backgroundImage: `url(${!this.props.isActive ? folderI : folderA})` }}
        >
          <div className={styles.flex5} />
          <div
            className={[
              styles.flex1,
              styles.w100
            ].join(' ')}
          >
            {this.props.changedTitle || this.props.note.name}
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
  }
}


NotesItem.propTypes = {
  note: PropTypes.shape().isRequired,
  onNoteCheck: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  changedTitle: PropTypes.string
};

NotesItem.defaultProps = {
  changedTitle: null
};

export default NotesItem;
