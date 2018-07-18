import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import css from './Settings.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class Settings extends Component {
  state = {
    settings: {}
  };
  componentWillMount() {
    this.setState({ settings: this.props.settings });
  }
  toggleSetting = (groupKey, key) => {
    this.setState({
      settings: {
        ...this.state.settings,
        [groupKey]: {
          ...this.state.settings[groupKey],
          [key]: !this.state.settings[groupKey][key]
        }
      }
    });
  };
  render() {
    return (
      <div
        className={[
          styles.flex,
          styles.justifyBetween,
          styles.wh100
        ].join(' ')}
      >
        {
          Object.keys(this.state.settings).map((settingsKey, i) => (
            <div
              key={i}
              className={[
                styles.flexColumn,
                styles.w100,
                styles.SettingColumn
              ].join(' ')}
            >
              <div style={{ marginBottom: 15 }}>
                <h3>
                  {settingsKey.replace(/([A-Z])|_/g, ' $1').toUpperCase()}
                </h3>
              </div>
              <div
                className={[
                  styles.flexColumn
                ].join(' ')}
              >
                {
                  Object.keys(this.state.settings[settingsKey]).map((settingKey, j) => (
                    <button
                      key={j}
                      type="button"
                      className={[
                        styles.transparentButton,
                        styles.flexBetweenCenter
                      ].join(' ')}
                      onClick={() => this.toggleSetting(settingsKey, settingKey)}
                    >
                      <div
                        className={[
                          styles.flexColumn,
                          styles.justifyCenter,
                          styles.wh100,
                          styles.alignStart
                        ].join(' ')}
                      >
                        {settingKey.replace(/([A-Z])|_/g, ' $1').toUpperCase()}
                      </div>
                      <div
                        className={[
                          styles.flexColumn,
                          styles.justifyCenter,
                          styles.wh100,
                          styles.alignEnd
                        ].join(' ')}
                      >
                        {this.state.settings[settingsKey][settingKey] ? 'on' : 'off'}
                      </div>
                    </button>
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}

Settings.propTypes = {
  settings: PropTypes.shape().isRequired
};

const mapStateToProps = state => ({
  settings: state.raft.settings
});

export default connect(mapStateToProps)(Settings);