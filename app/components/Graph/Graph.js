import React from 'react';
import PropTypes from 'prop-types';

import css from './Graph.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const graph = props => {
  const segments = [...Array(props.segments).keys()];
  const progress2segments = Math.round(props.segments * props.progress);
  return (
    <div className={styles.GraphWrapper}>
      <div>
        {
          segments.map((v, k) => (
            <div
              className={[
                styles.ProgressSegment,
                (k + 1) <= progress2segments ? styles.White : null
              ].join(' ')}
            />
          ))
        }
      </div>
    </div>
  );
};

graph.propTypes = {
  segments: PropTypes.number,
  progress: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired
};

graph.defaultProps = {
  segments: 16
};

export default graph;
