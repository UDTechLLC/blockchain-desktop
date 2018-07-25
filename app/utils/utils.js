import _ from 'lodash';
import { MONTH_ARRAY } from './const';

/**
 * util function for updating object
 * @param oldObject {Object}
 * @param updatedProperties {Object}
 * @returns {Object}
 */
const updateObject = (oldObject, updatedProperties) => (
  {
    ...oldObject,
    ...updatedProperties
  }
);

/**
 * turn base64 string to blob object
 * @param b64string
 * @returns {Blob}
 */
const b64toBlob = b64string => {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  // check if b64string contains mime type
  const containMimeType = b64string.indexOf(',') >= 0;

  //  separate b64string
  const byteString = containMimeType ? atob(b64string.split(',')[1]) : atob(b64string);

  // separate out the mime component
  const mimeString = containMimeType ? b64string.split(',')[0].split(':')[1].split(';')[0] : 'text/plain';

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  const ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }
  // write the ArrayBuffer to a blob, and you're done
  return new Blob([ab], { type: mimeString });
};

/**
 * transform bytes to kbytes
 * @param bytes {number}
 * @return {Number || null}
 */
const bytes2Kbytes = bytes => parseFloat(bytes / 1024).toFixed(2);

/**
 * transform bytes to mbytes
 * @param bytes {number}
 * @return {Number || null}
 */
const bytes2Mbytes = bytes => {
  const a = bytes % (1024 * 1024) > 0
    ? (bytes - (bytes % (1024 * 1024))) / (1024 * 1024)
    : bytes / (1024 * 1024);
  return a > 0 ? a : null;
};

/**
 * transform bytes to gbytes
 * @param bytes {number}
 * @return {Number || null}
 */
const bytes2Gbytes = bytes => {
  const a = bytes % (1024 * 1024 * 1024) > 0
    ? (bytes - (bytes % (1024 * 1024 * 1024))) / (1024 * 1024 * 1024)
    : bytes / (1024 * 1024 * 1024);
  return a > 0 ? a : null;
};

/**
 * transform bytes to tbytes
 * @param bytes {number}
 * @return {Number || null}
 */
const bytes2Tbytes = bytes => {
  const a = bytes % (1024 * 1024 * 1024 * 1024) > 0
    ? (bytes - (bytes % (1024 * 1024 * 1024 * 1024))) / (1024 * 1024 * 1024 * 1024)
    : bytes / (1024 * 1024 * 1024 * 1024);
  return a > 0 ? a : null;
};

/**
 * transform bytes to mbytes
 * @param bytes {number}
 * @return {String}
 */
const bytes2HumanReadableSize = bytes => {
  let tb;
  let gb;
  let mb;
  let kb;
  if (bytes2Tbytes(bytes) && bytes2Tbytes(bytes) > 0) {
    tb = `${bytes2Tbytes(bytes)} Tb`;
  } else if (bytes2Gbytes(bytes) && bytes2Gbytes(bytes) > 0) {
    gb = `${bytes2Gbytes(bytes)} Gb`;
  } else if (bytes2Mbytes(bytes) && bytes2Mbytes(bytes) > 0) {
    mb = `${bytes2Mbytes(bytes)} Mb`;
  } else if (bytes2Kbytes(bytes)) { kb = `${bytes2Kbytes(bytes)} Kb`; }
  return (tb || '') + (gb || '') + (mb || '') + (kb || '');
};

/**
 * transform timestamp to human readable date
 * @param timestamp {number}
 * @return {String}
 */
const timestamp2date = timestamp => {
  const date = new Date(timestamp);
  const month = MONTH_ARRAY[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month.substr(0, 3)} ${day}, ${year}`;
};

/**
 * sort obj desc or asc by key
 * @param obj {object}
 * @param key {string}
 * @param order {string}
 * @return {Object}
 */
const objOrderBy = (obj, key = 'timestamp', order = 'desc') => (
  _.chain(obj)
    .toPairs()
    .orderBy(o => o[1][key], [order])
    .fromPairs()
);

/**
 * get clean filename from full filename string
 * @param fileName {String}
 * @returns {String}
 */
const getFileName = fileName => (
  fileName.lastIndexOf('.') >= 0
    ? fileName.substr(0, fileName.lastIndexOf('.'))
    : fileName
);

/**
 * get extension from full filename string
 * @param fileName {String}
 * @returns {String}
 */
const getFileExtension = fileName => (
  fileName.lastIndexOf('.') >= 0
    ? fileName.substr(fileName.lastIndexOf('.') + 1)
    : undefined
);

/**
 * parse security layer key to human readable view
 * @param key {String}
 * @returns {String}
 */
const parseSecurityLayerKey = key => key.replace(/([A-Z])|_/g, ' $1');

export {
  updateObject,
  b64toBlob,
  bytes2Kbytes,
  bytes2Mbytes,
  bytes2Gbytes,
  bytes2Tbytes,
  bytes2HumanReadableSize,
  timestamp2date,
  objOrderBy,
  getFileName,
  getFileExtension,
  parseSecurityLayerKey
};
