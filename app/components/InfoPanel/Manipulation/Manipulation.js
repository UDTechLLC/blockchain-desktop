import React from 'react';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-datetime-picker';

import Button from '../../UI/Button/Button';

import css from './Manipulation.css';
import pickerCss from '../../../assets/css/customTimepicker.css';
import commonCss from '../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...pickerCss, ...css };

const Manipulation = props => (
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
        styles.flexColumn,
        styles.justifyBetween
      ].join(' ')}
    >
      <h3 className={styles.orangeHeader}>
        ADD GHOST TIME
      </h3>
      <div
        className={[
          styles.wh100,
          styles.flexBetweenCenter
        ].join(' ')}
      >
        <div
          className={[
            styles.flex1
          ].join(' ')}
        >
          <div className={styles.Subtitle}>
            <div>
              OPTIONAL SECURITY LEVEL
            </div>
            <div>
              CRYPTYC
            </div>
          </div>
        </div>
        <div
          className={[
            styles.flex1,
            styles.flex,
            styles.justifyEnd,
            styles.ButtonWrapper
          ].join(' ')}
        >
          <Button
            onClick={() => props.onTopManipulationButtonClick()}
            disabled={props.disableManipulationButtons}
          >
            {props.firstButtonText}
          </Button>
        </div>
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
      <div
        className={[
          styles.flexBetweenCenter,
          styles.pickerWrapper,
          styles.TimpickerWrapper,
          props.disableManipulationButtons ? styles.Disabled : null
        ].join(' ')}
      >
        <DateTimePicker
          onChange={() => props.onTimepickerChange()}
          value={props.timepickerDate}
        />
        <button
          type="button"
          onClick={() => props.onTimebombSet()}
        >
          set
        </button>
      </div>
      <div
        className={[
          styles.flex1,
          styles.absolute100,
          styles.flexColumn,
          styles.justifyCenter,
          !props.showRemoveButton ? styles.alignEnd : null
        ].join(' ')}
        style={{
          zIndex: !props.showRemoveButton ? 1 : 11
        }}
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
              onClick={() => props.onBottomManipulationButtonClick()}
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

Manipulation.propTypes = {
  disableManipulationButtons: PropTypes.bool.isRequired,
  showRemoveButton: PropTypes.bool.isRequired,
  toggleShowRemoveButton: PropTypes.func.isRequired,
  timepickerDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  onTimepickerChange: PropTypes.func.isRequired,
  onTimebombSet: PropTypes.func.isRequired,
  onTopManipulationButtonClick: PropTypes.func.isRequired,
  onBottomManipulationButtonClick: PropTypes.func.isRequired,
  firstButtonText: PropTypes.string
};

Manipulation.defaultProps = {
  firstButtonText: 'download'
};

export default Manipulation;
