/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';

import { folder } from '../../../../../assets/img/img';
import css from './FodlerItem.css';
import cornersCss from '../../../../../assets/css/corners.css';
import commonCss from '../../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...cornersCss, ...css };

const ghostFolders = props => (
  <div
    className={[
      styles.w100,
      styles.FolderItem
    ].join(' ')}
  >
    <div
      className={
        !props.isActive
          ? styles.absolute100
          : [
            styles.absolute100,
            styles.Active
          ].join(' ')
      }
      style={{ backgroundImage: `url(${folder})` }}
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
          <button
            type="button"
            className={styles.transparentButton}
            onClick={() => props.onDelete(props.folder.name)}
          >
            delete
          </button>
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => props.onFolderCheck(props.folder.name)}
          className={[
            styles.flex,
            styles.wh100,
            styles.flex4,
            styles.SecurityLayers
          ].join(' ')}
        >
          {
            Object.keys(props.folder.securityLayers).map((key, i) => (
              <div key={i}>
                {props.folder.securityLayers[key] ? key : null}
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
          {props.folder.name}
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

ghostFolders.propTypes = {
  folder: PropTypes.shape().isRequired,
  onFolderCheck: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
  onDelete: PropTypes.func.isRequired
};

ghostFolders.defaultProps = {
  isActive: false
};

export default ghostFolders;
