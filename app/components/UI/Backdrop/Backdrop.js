/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';

import css from './Backdrop.css';

const backdrop = props => (
  props.show
    ? (
      <div
        role="button"
        tabIndex={-1}
        className={[
          css.Backdrop,
          !props.transparent ? null : css.Transparent
        ].join(' ')}
        onClick={() => props.onClick()}
      />
    )
    : null
);

backdrop.propTypes = {
  show: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  transparent: PropTypes.bool
};

backdrop.defaultProps = {
  transparent: false
};

export default backdrop;
