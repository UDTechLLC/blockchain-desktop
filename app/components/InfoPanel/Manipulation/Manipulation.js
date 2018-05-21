import React from 'react';

import css from './Manipulation.css';
import commonCss from '../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const manipulation = () => (
  <div
    className={[
      styles.wh100,
      styles.flexColumnAllCenter,
      styles.Manipulation
    ].join(' ')}
  >
    manipulation block
  </div>
);

export default manipulation;
