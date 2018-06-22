import React from 'react';
import PropTypes from 'prop-types';

import { folderA } from '../../../assets/img/img';
import css from './AddButton.css';
import commonCss from '../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const addButton = props => (
  <button
    className={[
      styles.transparentButton,
      styles.AddButton
    ].join(' ')}
    type="button"
    onClick={() => props.onClick()}
    style={{
      width: `calc(100% / ${props.numberInRow})`,
      paddingTop: `calc(100% / ${props.numberInRow * props.aspectRatio})`
    }}
  >
    <div
      className={[
        styles.absolute100,
        styles.flex,
        styles.alignEnd,
        styles.justifyEnd,
        styles.orange
      ].join(' ')}
      style={{
        backgroundImage: `url(${folderA})`
      }}
    >
      + add
    </div>
  </button>
);

addButton.propTypes = {
  onClick: PropTypes.func,
  numberInRow: PropTypes.number,
  aspectRatio: PropTypes.number
};

addButton.defaultProps = {
  onClick: null,
  numberInRow: 3,
  aspectRatio: 1
};

export default addButton;
