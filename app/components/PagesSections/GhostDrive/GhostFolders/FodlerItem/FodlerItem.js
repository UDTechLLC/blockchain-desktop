/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Aux from '../../../../../hoc/Aux/Aux';
import Backdrop from '../../../../UI/Backdrop/Backdrop';

import { folderI, folderA } from '../../../../../assets/img/img';
import css from './FodlerItem.css';
import cornersCss from '../../../../../assets/css/corners.css';
import commonCss from '../../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...cornersCss, ...css };

class GhostFolders extends Component {
  state = {
    trueDelete: false
  };
  handleToggleButton = () => this.setState({ trueDelete: !this.state.trueDelete });
  handleTrueDelete = () => {
    this.handleToggleButton();
    return this.props.onDelete(this.props.folder.name);
  };
  render() {
    return (
      <div
        className={[
          styles.w100,
          styles.FolderItem
        ].join(' ')}
      >
        <div
          className={[
            styles.absolute100,
            !this.props.isActive ? null : styles.Active
          ].join(' ')}
          style={{ backgroundImage: `url(${!this.props.isActive ? folderI : folderA})` }}
        >
          <div
            className={[
              styles.flexColumnBetweenCenter,
              styles.absolute100,
              styles.Content
            ].join(' ')}
          >
            <div
              className={[
                styles.flexAllCenter,
                styles.w100,
                styles.flex1,
                styles.DeleteButtonWrapper
              ].join(' ')}
            >
              <Aux>
                <Backdrop
                  show={this.state.trueDelete}
                  onClick={() => this.handleToggleButton()}
                  transparent
                />
                <button
                  type="button"
                  className={styles.transparentButton}
                  onClick={() => (
                    !this.state.trueDelete
                      ? this.handleToggleButton()
                      : this.handleTrueDelete()
                  )}
                >
                  {!this.state.trueDelete ? 'delete' : 'confirm'}
                </button>
              </Aux>
            </div>
            <div
              role="button"
              tabIndex={0}
              onClick={() => this.props.onFolderCheck(this.props.folder.name)}
              className={[
                styles.flex,
                styles.wh100,
                styles.flex4,
                styles.SecurityLayers
              ].join(' ')}
            >
              {
                Object.keys(this.props.folder.securityLayers).map((key, i) => (
                  <div key={i}>
                    {this.props.folder.securityLayers[key] ? key : null}
                  </div>
                ))
              }
            </div>
            <div
              className={[
                styles.flex1,
                styles.flexAllCenter
              ].join(' ')}
            >
              {this.props.folder.name}
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
        </div>
      </div>
    );
  }
}

GhostFolders.propTypes = {
  folder: PropTypes.shape().isRequired,
  onFolderCheck: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
  onDelete: PropTypes.func.isRequired
};

GhostFolders.defaultProps = {
  isActive: false
};

export default GhostFolders;
