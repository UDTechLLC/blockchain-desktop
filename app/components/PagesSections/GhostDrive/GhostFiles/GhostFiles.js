import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

import FileItem from './FileItem/FileItem';

import css from './GhostFiles.css';
import commonCss from '../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const ghostFiles = props => (
  <div
    className={[
      styles.flex,
      styles.wh100
    ].join(' ')}
  >
    {
      Object.keys(props.files).length
        ? (
          <div>
            {
              Object.keys(props.files).map((k, i) => (
                <FileItem key={i} file={props.files[k]} />
              ))
            }
          </div>
        )
        : (
          <Dropzone>
            <p>
              {`There is no files in folder "${props.folderInfo[Object.keys(props.folderInfo)[0]].name}"`}
            </p>
          </Dropzone>
        )
    }
  </div>
);

ghostFiles.propTypes = {
  folderInfo: PropTypes.shape().isRequired,
  files: PropTypes.shape()
};

ghostFiles.defaultProps = {
  files: {}
};

export default ghostFiles;
