/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Aux from '../../../../../hoc/Aux/Aux';
import Backdrop from '../../../../UI/Backdrop/Backdrop';
import TextThatOnDCChanged from '../../../../UI/TextThatOnDCChanged/TextThatOnDCChanged';

import { folderI, folderA } from '../../../../../assets/img/img';
import css from './FodlerItem.css';
import cornersCss from '../../../../../assets/css/corners.css';
import commonCss from '../../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...cornersCss, ...css };

class GhostFolders extends Component {
  state = { trueRemove: false };
  handleToggleButton = () => this.setState({ trueRemove: !this.state.trueRemove });
  handleTrueRemove = () => {
    this.handleToggleButton();
    return this.props.onRemove(this.props.folder.id);
  };
  render() {
    return (
      <button
        className={[
          styles.transparentButton,
          styles.w100,
          styles.relative,
          styles.marginXsBottom,
          styles.FolderItem,
          !this.props.isActive ? null : styles.Active
        ].join(' ')}
        onClick={() => this.props.onFolderCheck(this.props.folder.id)}
      >
        <div
          className={styles.absolute100}
          style={{ backgroundImage: `url(${!this.props.isActive ? folderI : folderA})` }}
        />
        <div
          className={[
            styles.flexAllCenter,
            styles.w100,
            styles.flex1,
            styles.RemoveButtonWrapper
          ].join(' ')}
        >
          <Aux>
            <Backdrop
              show={this.state.trueRemove}
              onClick={() => this.handleToggleButton()}
              transparent
            />
            <div
              role="button"
              tabIndex={0}
              className={styles.transparentButton}
              onClick={e => {
                e.stopPropagation();
                return !this.state.trueRemove
                  ? this.handleToggleButton()
                  : this.handleTrueRemove();
              }}
            >
              {!this.state.trueRemove ? 'delete' : 'confirm'}
            </div>
          </Aux>
        </div>
        <div
          className={[
            styles.flex1,
            styles.w100,
            styles.FolderNameWrapper
          ].join(' ')}
        >
          <TextThatOnDCChanged
            onClick={val => this.props.onFolderCheck(val)}
            value={!this.props.isActive ? this.props.folder.name : this.props.nameThatMayChange}
            defaultValue={this.props.folder.name}
            onValueChange={val => this.props.onNameThatMayChange(val)}
            onFolderNameEdit={() => this.props.onFolderNameEdit()}
          />
        </div>
        <div
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

GhostFolders.propTypes = {
  folder: PropTypes.shape().isRequired,
  onFolderCheck: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
  onRemove: PropTypes.func.isRequired,
  nameThatMayChange: PropTypes.string.isRequired,
  onNameThatMayChange: PropTypes.func.isRequired,
  onFolderNameEdit: PropTypes.func.isRequired
};

GhostFolders.defaultProps = {
  isActive: false
};

export default GhostFolders;
