import { MONTH_ARRAY } from './const';

export const bytes2Kbytes = bytes => {
  const a = bytes % 1024 > 0
    ? (bytes - (bytes % 1024)) / 1024
    : bytes / 1024;
  return a > 0 ? a : null;
};

export const bytes2Mbytes = bytes => {
  const a = bytes % (1024 * 1024) > 0
    ? (bytes - (bytes % (1024 * 1024))) / (1024 * 1024)
    : bytes / (1024 * 1024);
  return a > 0 ? a : null;
};

export const bytes2Gbytes = bytes => {
  const a = bytes % (1024 * 1024 * 1024) > 0
    ? (bytes - (bytes % (1024 * 1024 * 1024))) / (1024 * 1024 * 1024)
    : bytes / (1024 * 1024 * 1024);
  return a > 0 ? a : null;
};

export const bytes2Tbytes = bytes => {
  const a = bytes % (1024 * 1024 * 1024 * 1024) > 0
    ? (bytes - (bytes % (1024 * 1024 * 1024 * 1024))) / (1024 * 1024 * 1024 * 1024)
    : bytes / (1024 * 1024 * 1024 * 1024);
  return a > 0 ? a : null;
};

export const bytes2HumanReadableSize = bytes => {
  const tb = bytes2Tbytes(bytes) && bytes2Tbytes(bytes) > 0
    ? `${bytes2Tbytes(bytes)} Tb` : null;
  const gb = bytes2Gbytes(bytes) && bytes2Gbytes(bytes) > 0
    ? `${bytes2Gbytes(bytes)} Gb` : null;
  const mb = bytes2Mbytes(bytes) && bytes2Mbytes(bytes) > 0
    ? `${bytes2Mbytes(bytes)} Mb` : null;
  const kb = bytes2Kbytes(bytes) && bytes2Kbytes(bytes) > 0
    ? `${bytes2Kbytes(bytes)} Kb` : null;
  return (tb || null) + (gb || null) + (mb || null) + (kb || null);
};

export const timestamp2date = timestamp => {
  const date = new Date(timestamp * 1000);
  const month = MONTH_ARRAY[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month.substr(0, 3)} ${day}, ${year}`;
};
