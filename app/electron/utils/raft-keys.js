/**
 * return users folders key in raft
 * @param cpk {String}
 * @returns {String}
 */
const foldersKey = cpk => `${cpk}_flds`;

/**
 * return users files key in raft
 * @param cpk {String}
 * @returns {String}
 */
const filesKey = cpk => `${cpk}_fls`;

/**
 * return users notes key in raft
 * @param cpk {String}
 * @returns {String}
 */
const notesKey = cpk => `${cpk}_nts`;

/**
 * return users settings key in raft
 * @param cpk {String}
 * @returns {String}
 */
const settingsKey = cpk => `${cpk}_stt`;

module.exports = {
  foldersKey,
  filesKey,
  notesKey,
  settingsKey
};