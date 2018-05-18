import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

import FileItem from './FileItem/FileItem';

import css from './GhostFiles.css';
import commonCss from '../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const ghostFiles = props => {
  const dropzone = (
    <Dropzone>
      {
        !Object.keys(props.files).length
          ? (
            <p>
              {`There is no files in folder "${props.folderInfo[Object.keys(props.folderInfo)[0]].name}"`}
            </p>
          )
          : null
      }
    </Dropzone>
  );
  return (
    <div
      className={[
        styles.flex,
        styles.wh100,
        styles.GhostFiles
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
              <div
                className={[
                  styles.absolute100,
                  styles.wh100,
                  styles.DropzoneWrapper
                ].join(' ')}
              >
                {dropzone}
              </div>
            </div>
          )
          : (
            <div
              className={[
                styles.wh100,
                styles.DropzoneWrapper
              ].join(' ')}
            >
              {dropzone}
            </div>
          )
      }
    </div>
  );
};

ghostFiles.propTypes = {
  folderInfo: PropTypes.shape().isRequired,
  files: PropTypes.shape()
};

ghostFiles.defaultProps = {
  files: {}
};

export default ghostFiles;
