import React, { Component } from 'react';
import PropTypes from 'prop-types';

import InfoPanel from './InfoPanel/InfoPanel';

import css from './InfoPanelWrapper.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class InfoPanelWrapper extends Component {
  state = { hide: false };
  handleTogglePanel = () => this.setState({ hide: !this.state.hide });
  render() {
    return (
      <div className={styles.wh100}>
        <div
          className={[
            styles.flexColumn,
            styles.w100,
            styles.Content,
            !this.state.hide ? undefined : styles.ContentWithHidenInfo
          ].join(' ')}
        >
          {this.props.children}
        </div>
        <div
          className={[
            styles.paddingSmRight,
            styles.paddingSmLeft,
            styles.InfoPanel,
            !this.state.hide ? undefined : styles.HidenPanel
          ].join(' ')}
        >
          <InfoPanel
            columns={this.props.columns}
            handleTogglePanel={this.handleTogglePanel}
            hide={this.state.hide}
            disableManBtns={this.props.disableManBtns}
            showRemoveButton={this.props.showRemoveButton}
            toggleShowRemoveBtn={this.props.toggleShowRemoveBtn}
            onTopManBtnClick={this.props.onTopManBtnClick}
            onBottomManBtnClick={this.props.onBottomManBtnClick}
            firstManBtnText={this.props.firstManBtnText}
            timePickerDate={this.props.timePickerDate}
            onTimePickerChange={date => this.props.onTimePickerChange(date)}
            onGhostTimeSet={this.props.onGhostTimeSet}
          />
        </div>
      </div>
    );
  }
}

InfoPanelWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  columns: PropTypes.arrayOf(PropTypes.string),
  //  manipulation section
  //  buttons
  disableManBtns: PropTypes.bool,
  showRemoveButton: PropTypes.bool,
  toggleShowRemoveBtn: PropTypes.func,
  onTopManBtnClick: PropTypes.func,
  onBottomManBtnClick: PropTypes.func,
  firstManBtnText: PropTypes.string,
  //  GhostTime
  timePickerDate: PropTypes.instanceOf(Date),
  onTimePickerChange: PropTypes.func,
  onGhostTimeSet: PropTypes.func
};

InfoPanelWrapper.defaultProps = {
  columns: ['SecurityLayer', 'Manipulation'],
  disableManBtns: false,
  showRemoveButton: false,
  toggleShowRemoveBtn: () => undefined,
  onTopManBtnClick: () => undefined,
  onBottomManBtnClick: () => undefined,
  firstManBtnText: 'download',
  timePickerDate: new Date(),
  onTimePickerChange: () => undefined,
  onGhostTimeSet: () => undefined
};

export default InfoPanelWrapper;
