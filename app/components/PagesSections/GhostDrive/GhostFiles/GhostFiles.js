import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

import FileItem from './FileItem/FileItem';
import WithCustomScrollbar from '../../../../components/UI/WithCustomScrollbar/WithCustomScrollbar';

import css from './GhostFiles.css';
import commonCss from '../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const ghostFiles = props => {
  const dropzone = (
    <Dropzone
      onDrop={(accepted, rejected) => props.onDrop(accepted, rejected)}
      maxSize={102400000}
      className={styles.flexAllCenter}
    >
      {
        !Object.keys(props.files).length
          ? (
            <p>
              {
                `There is no files in folder "${props.folderInfo[Object.keys(props.folderInfo)[0]].name}".` +
                ' You can drop it here or upload file with click.'
              }
            </p>
          )
          : undefined
      }
    </Dropzone>
  );
  return (
    <div
      className={[
        styles.flexColumn,
        styles.flex0050,
        styles.h100,
        styles.paddingSm,
        styles.GhostFiles
      ].join(' ')}
    >
      <WithCustomScrollbar>
        {
          Object.keys(props.files).length
            ? (
              <div
                className={[
                  styles.flex,
                  styles.wh100,
                  styles.paddingSm,
                  styles.ItemsWrapper
                ].join(' ')}
              >
                {
                  Object.keys(props.files).map((k, i) => (
                    <FileItem
                      key={i}
                      file={props.files[k]}
                      isActive={props.files[k].signature === props.activeFile}
                      onFileCheck={signature => props.onFileCheck(signature)}
                    />
                  ))
                }
                <div
                  className={[
                    styles.absolute100,
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
      </WithCustomScrollbar>
    </div>
  );
};

ghostFiles.propTypes = {
  files: PropTypes.shape().isRequired,
  onFileCheck: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  activeFile: PropTypes.string,
  folderInfo: PropTypes.shape().isRequired,
};

ghostFiles.defaultProps = {
  activeFile: undefined
};

export default ghostFiles;
