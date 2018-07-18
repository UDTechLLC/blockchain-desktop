import React from 'react';
import PropTypes from 'prop-types';

import { arrDown } from '../../../assets/img/img';
import css from './VerticalLineV.css';
import commonCss from './../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const verticalLineV = ({ count }) => {
  const imgs = [];
  for (let i = 0; i < count; i += 1) {
    imgs.push(<img src={arrDown} key={i} alt="&#709;" />);
  }
  return (
    <div
      className={[
        // styles.paddingSmTop,
        // styles.paddingSmBottom,
        styles.VerticalLineV
      ].join(' ')}
    >
      {imgs}
    </div>
  );
};

verticalLineV.propTypes = {
  count: PropTypes.number.isRequired
};

export default verticalLineV;
