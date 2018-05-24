import React from 'react';
import PropTypes from 'prop-types';

import Button from '../../UI/Button/Button';

import css from './Manipulation.css';
import commonCss from '../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const manipulation = props => (
  <div
    className={[
      styles.wh100,
      styles.flexColumnBetweenCenter,
      styles.Manipulation
    ].join(' ')}
  >
    <div
      className={[
        styles.flex1,
        styles.wh100,
        styles.flexBetweenCenter
      ].join(' ')}
    >
      <div
        className={[
          styles.flex1
        ].join(' ')}
      >
        <h3>GHOST TIME</h3>
      </div>
      <div
        className={[
          styles.flex1,
          styles.flex,
          styles.justifyEnd
        ].join(' ')}
      >
        <Button
          onClick={() => props.handleDownloadFile()}
          disabled={props.disableManipulationButtons}
        >
          download
        </Button>
      </div>
    </div>
    <div
      className={[
        styles.flex1,
        styles.flexBetweenCenter,
        styles.w100,
        styles.Bottom
      ].join(' ')}
    >
      <div>
        datepicker
      </div>
      <div
        className={[
          styles.flex1,
          styles.absolute100,
          styles.flexColumn,
          styles.justifyCenter,
          !props.showRemoveButton ? styles.alignEnd : null
        ].join(' ')}
      >
        <div
          className={[
            styles.flexBetweenCenter,
            styles.ConfirmationDeleteWrapper
          ].join(' ')}
          style={props.showRemoveButton ? { backgroundColor: '#006694' } : null}
        >
          <Button
            type="button"
            onClick={() => props.toggleShowRemoveButton()}
            disabled={props.disableManipulationButtons}
            btnStyles={props.showRemoveButton ? ['Transparent', 'InsideFlex'] : null}
          >
            {props.showRemoveButton ? 'deny' : 'delete'}
          </Button>
          <div
            className={styles.w100}
            style={props.showRemoveButton ? null : { display: 'none' }}
          >
            <Button
              type="button"
              onClick={() => props.handleRemoveFile()}
              disabled={props.disableManipulationButtons}
              btnStyles={props.showRemoveButton ? ['Transparent', 'InsideFlex'] : null}
            >
              confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

manipulation.propTypes = {
  disableManipulationButtons: PropTypes.bool.isRequired,
  handleDownloadFile: PropTypes.func.isRequired,
  handleRemoveFile: PropTypes.func.isRequired,
  showRemoveButton: PropTypes.bool.isRequired,
  toggleShowRemoveButton: PropTypes.func.isRequired
};

export default manipulation;
