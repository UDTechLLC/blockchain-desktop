import React from 'react';
import PropTypes from 'prop-types';

import ghost2 from '../../../assets/img/ghost2.svg';
import polygon2 from '../../../assets/img/polygon2.svg';
import ghost3 from '../../../assets/img/ghost3.svg';
import polygon3 from '../../../assets/img/polygon3.svg';
import classes from './Loading.css';

const Loading = props => {
  let ghost;
  let polygon;
  switch (props.color) {
    case 'white':
      ghost = <img className={classes.Ghost} src={ghost3} alt="ghost" />;
      polygon = <img className={classes.Polygon} src={polygon3} alt="polygon" />;
      break;
    default:
      ghost = <img className={classes.Ghost} src={ghost2} alt="ghost" />;
      polygon = <img className={classes.Polygon} src={polygon2} alt="polygon" />;
      break;
  }
  return (
    <div className={classes.GhostWrapper}>
      {ghost}
      <div className={classes.AllPolygons}>
        <div className={classes.TopPolygons}>
          {polygon}
          {polygon}
        </div>
        <div className={classes.BottomPolygon}>
          {polygon}
        </div>
      </div>
    </div>
  );
};

Loading.propTypes = {
  color: PropTypes.string
};

Loading.defaultProps = {
  color: 'blue'
};

export default Loading;
