import React from 'react';
import PropTypes from 'prop-types';

const fileItem = props => (
  <div>
    {props.file.name}
  </div>
);

fileItem.propTypes = {
  file: PropTypes.shape().isRequired
};

export default fileItem;
