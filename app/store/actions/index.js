export {
  registration,
  authSuccess,
  auth,
  logout
} from './auth';
export {
  // getCredFilesList,
  checkInternet
} from './commonInfo';
export { getBalance } from './blockchain';
export { getDigest } from './digest';
// export {
//   getNotes,
//   editNotesList,
//   deleteNote
// } from './notes';
export {
  getAppSettings,
  getUserData,
  createNewFolder,
  editFolder,
  deleteFolder,
  uploadFiles,
  downloadFile,
  saveDownloadedFile,
  removeFile,
  createNote,
  editNote,
  removeNote,
  setTimebomb
} from './raft';
