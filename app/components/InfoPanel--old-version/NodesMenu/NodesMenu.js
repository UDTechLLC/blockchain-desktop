import React, { Component } from 'react';

import css from './NodesMenu.css';
import commonCss from '../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class NodesMenu extends Component {
  state = {
    nodes: [
      {
        label: 3,
        value: 3,
        disabled: false
      },
      {
        label: 9,
        value: 9,
        disabled: true
      },
      {
        label: 27,
        value: 27,
        disabled: true
      },
      {
        label: 81,
        value: 81,
        disabled: true
      }
    ]
  };
  render() {
    return (
      <div
        className={[
          styles.wh100,
          styles.flexColumn,
          styles.justifyCenter,
          styles.alignEnd,
          styles.NodesMenu
        ].join(' ')}
      >
        <h3>Nodes</h3>
        <ul>
          {
            this.state.nodes.map((node, i) => (
              <li key={i}>
                <button
                  type="button"
                  disabled={node.disabled}
                  className={
                    i !== 0
                      ? styles.transparentButton
                      : [
                          styles.transparentButton,
                          styles.w100,
                          styles.Active
                      ].join(' ')
                  }
                >
                  {node.label}
                </button>
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

export default NodesMenu;
