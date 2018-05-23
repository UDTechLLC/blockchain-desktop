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
            leftColumn={this.props.leftColumn}
            rightColumn={this.props.rightColumn}
            handleTogglePanel={() => this.handleTogglePanel()}
            hide={this.state.hide}
            disableManipulationButtons={this.props.disableManipulationButtons}
            handleDownloadFile={() => this.props.handleDownloadFile()}
            handleRemoveFile={() => this.props.handleRemoveFile()}
            showRemoveButton={this.props.showRemoveButton}
            toggleShowRemoveButton={() => this.props.toggleShowRemoveButton()}
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
  leftColumn: PropTypes.arrayOf(PropTypes.string),
  rightColumn: PropTypes.arrayOf(PropTypes.string),
  disableManipulationButtons: PropTypes.bool,
  handleDownloadFile: PropTypes.func,
  handleRemoveFile: PropTypes.func,
  showRemoveButton: PropTypes.bool,
  toggleShowRemoveButton: PropTypes.func
};

PageWithInfoPanel.defaultProps = {
  leftColumn: [
    'CreateFolder',
    'NodesMenu'
  ],
  rightColumn: [
    'SecurityLayer',
    'Manipulation'
  ],
  disableManipulationButtons: false,
  handleDownloadFile: null,
  handleRemoveFile: null,
  showRemoveButton: false,
  toggleShowRemoveButton: null
};

export default PageWithInfoPanel;
