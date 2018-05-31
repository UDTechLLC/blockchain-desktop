export const RELEASE_VERSION = 'BETA .01';
export const ROOT_HASH = '175aeb081e74c9116ac7f6677c874ff6963ce1f5';
export const ADMIN_ETH_WALLET = '0xa658b225a2c34579963612eea3d61c7755ebf8c6';
//  digest && blockchain addresses
let digest = 'http://wizeprotocol.com:8888';
let bc = 'http://master.wizeprotocol.com:4000';
if (process.env.NODE_ENV === 'development') {
  digest = 'http://localhost:8888';
  bc = 'http://localhost:4000';
}
export const DIGEST_URL = digest;
export const BLOCKCHAIN_URL = bc;
// export const DIGEST_URL = 'http://localhost:8888';
// export const BLOCKCHAIN_URL = 'http://localhost:4000';
// export const RAFT_URL = 'http://localhost:11001/key';
// export const FS_URL = 'http://localhost:13000/buckets';

// common
export const MONTH_ARRAY = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
