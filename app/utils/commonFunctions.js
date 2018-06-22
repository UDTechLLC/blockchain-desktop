import _ from 'lodash';
import { MONTH_ARRAY } from './const';

/**
 * transform bytes to kbytes
 * @param bytes {number}
 * @return {Number || null}
 */
export const bytes2Kbytes = bytes => parseFloat(bytes / 1024).toFixed(2);

/**
 * transform bytes to mbytes
 * @param bytes {number}
 * @return {Number || null}
 */
export const bytes2Mbytes = bytes => {
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
export const bytes2Gbytes = bytes => {
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
export const bytes2Tbytes = bytes => {
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
export const bytes2HumanReadableSize = bytes => {
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
export const timestamp2date = timestamp => {
  const date = new Date(timestamp * 1000);
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
export const objOrderBy = (obj, key = 'timestamp', order = 'desc') => (
  _.chain(obj)
    .toPairs()
    .orderBy(o => o[1][key], [order])
    .fromPairs()
);
