import React, { Component } from 'react';
import PropTypes from 'prop-types';

import InfoPanel from '../../components/InfoPanel/InfoPanel';

import css from './PageWithInfoPanel.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class PageWithInfoPanel extends Component {
  state = {
    hide: false
  };
  handleTogglePanel = () => this.setState({ hide: !this.state.hide });
  /*
  <div
            className={
              !this.state.hide
                ? styles.InfoPanel
                : [
                  styles.InfoPanel,
                  styles.HidenPanel
                ].join(' ')
            }
          >
            <InfoPanelWrapper
              action={() => this.handleTogglePanel()}
            >
              <div className={styles.InnerWrapper}>
                {this.state.leftColumn}
                {this.state.rightColumn}
              </div>
            </InfoPanelWrapper>
          </div>
   */
  render() {
    return (
      <div
        className={[
          styles.wh100,
          styles.Wrapper
        ].join(' ')}
      >
        <div
          className={
            !this.state.hide
              ? styles.Content
              : [
                styles.Content,
                styles.ContentWithHidenInfo
              ].join(' ')
          }
        >
          {this.props.children}
        </div>
        <div
          className={
            !this.state.hide
              ? styles.InfoPanel
              : [
                styles.InfoPanel,
                styles.HidenPanel
              ].join(' ')
          }
        >
          <InfoPanel
            columns={this.props.columns}
            handleTogglePanel={() => this.handleTogglePanel()}
            hide={this.state.hide}
            disableManipulationButtons={this.props.disableManipulationButtons}
            showRemoveButton={this.props.showRemoveButton}
            toggleShowRemoveButton={() => this.props.toggleShowRemoveButton()}
            onTopManipulationButtonClick={() => this.props.onTopManipulationButtonClick()}
            onBottomManipulationButtonClick={() => this.props.onBottomManipulationButtonClick()}
            manipulationFirstButtonText={this.props.manipulationFirstButtonText}
            timepickerDate={this.props.timepickerDate}
            onTimepickerChange={date => this.props.onTimepickerChange(date)}
            onTimebombSet={() => this.props.onTimebombSet()}
          />
        </div>
      </div>
    );
  }
}

PageWithInfoPanel.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  columns: PropTypes.arrayOf(PropTypes.string),
  //  manipulation section
  //  buttons
  disableManipulationButtons: PropTypes.bool,
  showRemoveButton: PropTypes.bool,
  toggleShowRemoveButton: PropTypes.func,
  onTopManipulationButtonClick: PropTypes.func,
  onBottomManipulationButtonClick: PropTypes.func,
  manipulationFirstButtonText: PropTypes.string,
  //  timebomb
  timepickerDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onTimepickerChange: PropTypes.func,
  onTimebombSet: PropTypes.func
};

PageWithInfoPanel.defaultProps = {
  columns: [
    'SecurityLayer',
    'Manipulation'
  ],
  disableManipulationButtons: false,
  showRemoveButton: false,
  toggleShowRemoveButton: null,
  onTopManipulationButtonClick: null,
  onBottomManipulationButtonClick: null,
  manipulationFirstButtonText: 'download',
  timepickerDate: new Date(),
  onTimepickerChange: null,
  onTimebombSet: null
};

export default PageWithInfoPanel;
